// Display today's date
const dateElement = document.getElementById("todayDate");
const today = new Date();
dateElement.textContent = today.toDateString();

// Simulate sales update
let sales = 450000;
setInterval(() => {
  sales += Math.floor(Math.random() * 50000);
  document.getElementById("salesToday").textContent =
    "UGX " + sales.toLocaleString();
}, 5000);

// Logout button
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    window.location.href = "logout.html";
  }
});

// Card click alert
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h2").textContent;
    alert(`You clicked on "${title}" card.`);
  });
});
