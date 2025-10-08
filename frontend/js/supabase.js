import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loginBtn = document.getElementById("login");
const authSection = document.getElementById("auth");
const dashSection = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");

loginBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) console.error("Login error:", error);
});

// check if user is logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (session && session.user) {
    authSection.hidden = true;
    dashSection.hidden = false;
    userEmail.textContent = session.user.email;
  } else {
    authSection.hidden = false;
    dashSection.hidden = true;
  }
});
