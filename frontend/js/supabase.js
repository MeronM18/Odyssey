import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://tujwaynsrxepissvvkpv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1andheW5zcnhlcGlzc3Z2a3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMjAyOTQsImV4cCI6MjA3Nzc5NjI5NH0.lO_3sHeoTsl3j2ubXc2Vb1mYYPoXI8qpfFRz98HEY6w";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loginBtn = document.getElementById("login");
const authSection = document.getElementById("auth");
const budgetSetupSection = document.getElementById("budget-setup");
const allocationSetupSection = document.getElementById("allocation-setup");
const dashSection = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");
const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudget");
const saveAllocationBtn = document.getElementById("saveAllocation");
const userBudgetDisplay = document.getElementById("userBudget");

const totalBudgetDisplay = document.getElementById("totalBudgetDisplay");
const flightsSlider = document.getElementById("flightsSlider");
const hotelsSlider = document.getElementById("hotelsSlider");
const eventsSlider = document.getElementById("eventsSlider");
const carsSlider = document.getElementById("carsSlider");

const flightsAmountInput = document.getElementById("flightsAmount");
const hotelsAmountInput = document.getElementById("hotelsAmount");
const eventsAmountInput = document.getElementById("eventsAmount");
const carsAmountInput = document.getElementById("carsAmount");

let currentBudget = 0;

loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/html/"
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

  currentBudget = budgetValue;
  budgetSetupSection.hidden = true;
  allocationSetupSection.hidden = false;
  totalBudgetDisplay.textContent = `$${budgetValue.toFixed(2)}`;
  updateAllocationAmounts();
});

function updateAllocationAmounts() {
  const flights = parseInt(flightsSlider.value);
  const hotels = parseInt(hotelsSlider.value);
  const events = parseInt(eventsSlider.value);
  const cars = parseInt(carsSlider.value);
  
  document.getElementById("flightsPercent").textContent = flights;
  flightsAmountInput.value = ((currentBudget * flights) / 100).toFixed(2);
  
  document.getElementById("hotelsPercent").textContent = hotels;
  hotelsAmountInput.value = ((currentBudget * hotels) / 100).toFixed(2);
  
  document.getElementById("eventsPercent").textContent = events;
  eventsAmountInput.value = ((currentBudget * events) / 100).toFixed(2);
  
  document.getElementById("carsPercent").textContent = cars;
  carsAmountInput.value = ((currentBudget * cars) / 100).toFixed(2);
  
  updateTotalPercent();
}

function updateFromAmount(category) {
  const amountInputs = {
    flights: flightsAmountInput,
    hotels: hotelsAmountInput,
    events: eventsAmountInput,
    cars: carsAmountInput
  };
  
  const sliders = {
    flights: flightsSlider,
    hotels: hotelsSlider,
    events: eventsSlider,
    cars: carsSlider
  };
  
  const percentSpans = {
    flights: document.getElementById("flightsPercent"),
    hotels: document.getElementById("hotelsPercent"),
    events: document.getElementById("eventsPercent"),
    cars: document.getElementById("carsPercent")
  };
  
  const amount = parseFloat(amountInputs[category].value) || 0;
  const percent = currentBudget > 0 ? Math.round((amount / currentBudget) * 100) : 0;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  
  sliders[category].value = clampedPercent;
  percentSpans[category].textContent = clampedPercent;
  
  updateTotalPercent();
}

function updateTotalPercent() {
  const flights = parseInt(flightsSlider.value);
  const hotels = parseInt(hotelsSlider.value);
  const events = parseInt(eventsSlider.value);
  const cars = parseInt(carsSlider.value);
  
  const total = flights + hotels + events + cars;
  const totalPercentEl = document.getElementById("totalPercent");
  totalPercentEl.textContent = `${total}%`;
  
  if (total === 100) {
    totalPercentEl.className = "total-percent valid";
  } else {
    totalPercentEl.className = "total-percent invalid";
  }
}

flightsSlider.addEventListener("input", updateAllocationAmounts);
hotelsSlider.addEventListener("input", updateAllocationAmounts);
eventsSlider.addEventListener("input", updateAllocationAmounts);
carsSlider.addEventListener("input", updateAllocationAmounts);

flightsAmountInput.addEventListener("input", () => updateFromAmount("flights"));
hotelsAmountInput.addEventListener("input", () => updateFromAmount("hotels"));
eventsAmountInput.addEventListener("input", () => updateFromAmount("events"));
carsAmountInput.addEventListener("input", () => updateFromAmount("cars"));

saveAllocationBtn.addEventListener("click", async () => {
  const flights = parseInt(flightsSlider.value);
  const hotels = parseInt(hotelsSlider.value);
  const events = parseInt(eventsSlider.value);
  const cars = parseInt(carsSlider.value);
  const total = flights + hotels + events + cars;
  
  if (total !== 100) {
    alert("Total allocation must equal 100%. Currently: " + total + "%");
    return;
  }

  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .update({ 
        total_budget: currentBudget,
        flights_percent: flights,
        hotels_percent: hotels,
        events_percent: events,
        cars_percent: cars
      })
      .eq("id", user.id)
      .select();

    if (error) throw error;

    allocationSetupSection.hidden = true;
    dashSection.hidden = false;
    userEmail.textContent = user.email;
    userBudgetDisplay.textContent = `$${currentBudget.toFixed(2)}`;
    
    console.log("Budget and allocations saved successfully:", data);
  } catch (error) {
    console.error("Error saving allocations:", error);
    alert("Failed to save allocations. Please try again.");
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
      allocationSetupSection.hidden = true;
      dashSection.hidden = true;
    } else if (!profile.flights_percent && !profile.hotels_percent) {
      authSection.hidden = true;
      budgetSetupSection.hidden = true;
      allocationSetupSection.hidden = false;
      dashSection.hidden = true;
      currentBudget = parseFloat(profile.total_budget);
      totalBudgetDisplay.textContent = `$${currentBudget.toFixed(2)}`;
      updateAllocationAmounts();
    } else {
      authSection.hidden = true;
      budgetSetupSection.hidden = true;
      allocationSetupSection.hidden = true;
      dashSection.hidden = false;
      userEmail.textContent = user.email;
      userBudgetDisplay.textContent = `$${parseFloat(profile.total_budget).toFixed(2)}`;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    authSection.hidden = true;
    budgetSetupSection.hidden = false;
    allocationSetupSection.hidden = true;
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
