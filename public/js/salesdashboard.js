// Placeholder structure; your server will inject real data dynamically
const salesData = {
  labels: [], // Month labels
  values: [], // Sales amounts
};

// Fill in cards dynamically if backend injects data
document.getElementById("totalSales").textContent = salesData.totalSales || 0;
document.getElementById("totalOrders").textContent = salesData.totalOrders || 0;
document.getElementById("activeAgents").textContent =
  salesData.activeAgents || 0;

// Chart.js
const ctx = document.getElementById("salesChart").getContext("2d");
const salesChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: salesData.labels,
    datasets: [
      {
        label: "Sales ($)",
        data: salesData.values,
        backgroundColor: "#004d40",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  },
});
