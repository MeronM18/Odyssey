import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://tujwaynsrxepissvvkpv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1andheW5zcnhlcGlzc3Z2a3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMjAyOTQsImV4cCI6MjA3Nzc5NjI5NH0.lO_3sHeoTsl3j2ubXc2Vb1mYYPoXI8qpfFRz98HEY6w";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loginBtn = document.getElementById("login");
const authSection = document.getElementById("auth");
const budgetSetupSection = document.getElementById("budget-setup");
const dashSection = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");
const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudget");
const userBudgetDisplay = document.getElementById("userBudget");

loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) console.error("Login error:", error);
});

saveBudgetBtn.addEventListener("click", async () => {
  const budgetValue = parseFloat(budgetInput.value);
  
  if (!budgetValue || budgetValue <= 0) {
    alert("Please enter a valid budget amount");
    return;
  }

  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .update({ total_budget: budgetValue })
      .eq("id", user.id)
      .select();

    if (error) throw error;

    budgetSetupSection.hidden = true;
    dashSection.hidden = false;
    userEmail.textContent = user.email;
    userBudgetDisplay.textContent = `$${budgetValue.toFixed(2)}`;
    
    console.log("Budget saved successfully:", data);
  } catch (error) {
    console.error("Error saving budget:", error);
    alert("Failed to save budget. Please try again.");
  }
});

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    await handleUserSession(session.user);
  } else {
    authSection.hidden = false;
    budgetSetupSection.hidden = true;
    dashSection.hidden = true;
  }
});

async function handleUserSession(user) {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    if (!profile.total_budget || profile.total_budget === 0) {
      authSection.hidden = true;
      budgetSetupSection.hidden = false;
      dashSection.hidden = true;
    } else {
      authSection.hidden = true;
      budgetSetupSection.hidden = true;
      dashSection.hidden = false;
      userEmail.textContent = user.email;
      userBudgetDisplay.textContent = `$${parseFloat(profile.total_budget).toFixed(2)}`;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    authSection.hidden = true;
    budgetSetupSection.hidden = false;
    dashSection.hidden = true;
  }
}

async function getFlights() {
  const { data, error } = await supabase
    .from("flights")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function getHotels() {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function getCars() {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("availability", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function createBooking(bookingData) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...bookingData, user_id: user.id }])
    .select();

  if (error) throw error;
  return data;
}

async function getUserBookings() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      flight:flights(*),
      hotel:hotels(*),
      event:events(*),
      car:cars(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function updateBooking(id, updates) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) throw error;
}

async function updateProfile(updates) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select();

  if (error) throw error;
  return data;
}

window.supabase = supabase;
window.getFlights = getFlights;
window.getHotels = getHotels;
window.getEvents = getEvents;
window.getCars = getCars;
window.createBooking = createBooking;
window.getUserBookings = getUserBookings;
window.updateBooking = updateBooking;
window.deleteBooking = deleteBooking;
window.updateProfile = updateProfile;
