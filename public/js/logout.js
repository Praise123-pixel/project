let countdown = 5;
const countdownEl = document.getElementById("countdown");

const interval = setInterval(() => {
  countdown--;
  countdownEl.textContent = countdown;

  if (countdown === 0) {
    clearInterval(interval);
    window.location.href = "index.html"; // Redirect to login page
  }
}, 1000);
