const form = document.getElementById("signupForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const role = document.getElementById("role");

// Show/Hide password
showPassword.addEventListener("change", () => {
  password.type = showPassword.checked ? "text" : "password";
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate all fields
  if (
    !firstName.value.trim() ||
    !lastName.value.trim() ||
    !email.value.trim() ||
    !password.value.trim() ||
    !role.value
  ) {
    alert("Please fill in all fields and select a role!");
    return;
  }

  // Email validation
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!email.value.match(emailPattern)) {
    alert("Please enter a valid email address!");
    return;
  }

  // Password length validation
  if (password.value.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  // Success alert
  alert(`Welcome ${firstName.value}! You signed up as ${role.value}.`);

  // Role-based redirect with firstName query parameter
  const rolePages = {
    CEO: "dashboard.html",
    Manager: "reports.html",
    "Sales Attendant": "sales.html",
    Admin: "inventory.html",
    Other: "customers.html",
  };

  const page = rolePages[role.value] || "dashboard.html";
  window.location.href = `${page}?firstName=${encodeURIComponent(
    firstName.value
  )}`;
});
