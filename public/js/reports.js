function formatCurrency(num) {
  return "UGX " + num.toLocaleString();
}
function calculateTotal() {
  const rows = document.querySelectorAll("#salesTable tbody tr");
  let total = 0;
  rows.forEach((row) => {
    if (row.style.display !== "none") {
      const value = parseInt(row.cells[5].textContent.replace(/[^0-9]/g, ""));
      if (!isNaN(value)) total += value;
    }
  });
  document.getElementById("totalSales").textContent = formatCurrency(total);
}
const rows = document.querySelectorAll("#salesTable tbody tr");
rows.forEach((row) => {
  const cell = row.cells[5];
  cell.textContent = formatCurrency(parseInt(cell.textContent));
  row.addEventListener("click", () => {
    alert(`📌 Sale Details:\n
Date: ${row.cells[0].textContent}
Customer: ${row.cells[1].textContent}
Product: ${row.cells[2].textContent}
Quantity: ${row.cells[3].textContent}
Agent: ${row.cells[4].textContent}
Total: ${row.cells[5].textContent}`);
  });
});
document.getElementById("searchInput").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  rows.forEach((row) => {
    const customer = row.cells[1].textContent.toLowerCase();
    const product = row.cells[2].textContent.toLowerCase();
    row.style.display =
      customer.includes(filter) || product.includes(filter) ? "" : "none";
  });
  calculateTotal();
});
document.getElementById("agentFilter").addEventListener("change", function () {
  const agent = this.value.toLowerCase();
  rows.forEach((row) => {
    const rowAgent = row.cells[4].textContent.toLowerCase();
    row.style.display = agent === "" || rowAgent === agent ? "" : "none";
  });
  calculateTotal();
});
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("agentFilter").value = "";
  rows.forEach((row) => (row.style.display = ""));
  calculateTotal();
});
document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "logout.html";
  }
});
calculateTotal();
