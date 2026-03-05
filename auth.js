/* ================= REGISTER ================= */

function register(event) {
  event.preventDefault();   // stop form refresh

  const company = document.getElementById("companyName").value.trim();
  const password = document.getElementById("password").value.trim();
  const industry = document.getElementById("industry").value.trim();
  const location = document.getElementById("location").value.trim();
  const about = document.getElementById("about").value.trim();

  if (!company || !password || !industry || !location) {
    alert("Please fill all required fields");
    return;
  }

  localStorage.setItem("companyName", company);
  localStorage.setItem("password", password);
  localStorage.setItem("industry", industry);
  localStorage.setItem("companyLocation", location);
  localStorage.setItem("companyDescription", about);

  alert("Registration Successful!");

  window.location.href = "login.html";
}


/* ================= LOGIN ================= */

function login(event) {
  event.preventDefault();   // stop refresh

  const company = document.getElementById("companyName").value.trim();
  const password = document.getElementById("password").value.trim();

  const storedCompany = localStorage.getItem("companyName");
  const storedPassword = localStorage.getItem("password");

  if (company === storedCompany && password === storedPassword) {
    localStorage.setItem("currentCompany", company);

    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "index.html";

  } else {
    alert("Invalid Company Name or Password");
  }
}


/* ================= LOGOUT ================= */

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}