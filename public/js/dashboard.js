// dashboard.js
// This script fetches dashboard data from your backend APIs and renders KPIs, recent sales and charts.
// IMPORTANT: adapt endpoint URLs if your API paths differ.

let salesTrendChart = null;
let stockPieChart = null;

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    // handle auth or server errors gracefully
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function loadUser() {
  try {
    const user = await fetchJSON('/api/auth/me'); // should return { id, name, role }
    document.getElementById('userGreeting').textContent = `Hi, ${user.name} (${user.role})`;
    applyRoleVisibility(user.role);
  } catch (err) {
    console.error('Unable to load user info', err);
    // if unauthenticated, redirect to login
    // window.location.href = '/login.html';
  }
}

function applyRoleVisibility(role) {
  // Example: hide Users management unless Admin/CEO
  const adminNav = document.getElementById('adminNav');
  if (!['Admin','CEO','Manager'].includes(role)) {
    adminNav.style.display = 'none';
  } else {
    adminNav.style.display = '';
  }
}

async function loadKPIs() {
  // Expected: GET /api/dashboard/summary
  // Example expected response:
  // {
  //   totalStockItems: 120,
  //   salesToday: 15,
  //   salesThisMonth: 320,
  //   lowStockCount: 3,
  //   pendingDeliveries: 2
  // }
  try {
    const summary = await fetchJSON('/api/dashboard/summary');
    document.getElementById('kpiTotalStock').textContent = summary.totalStockItems ?? '0';
    document.getElementById('kpiSalesToday').textContent = summary.salesToday ?? '0';
    document.getElementById('kpiSalesMonth').textContent = summary.salesThisMonth ?? '0';
    document.getElementById('kpiLowStock').textContent = summary.lowStockCount ?? '0';
  } catch (err) {
    console.error('Failed to load KPIs', err);
  }
}

async function loadRecentSales() {
  // Expected: GET /api/sales?limit=5
  // Example item: { id, customerName, productName, quantity, total, saleDate }
  try {
    const recent = await fetchJSON('/api/sales?limit=5');
    const tbody = document.querySelector('#recentSalesTable tbody');
    tbody.innerHTML = '';
    if (!Array.isArray(recent) || recent.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No recent sales</td></tr>';
      return;
    }
    recent.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(s.customerName || '')}</td>
        <td>${escapeHtml(s.productName || '')}</td>
        <td>${s.quantity ?? ''}</td>
        <td>${formatCurrency(s.total ?? 0)}</td>
        <td>${formatDate(s.saleDate)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load recent sales', err);
  }
}

async function loadLowStockList() {
  // Expected: GET /api/inventory/low (or /api/inventory?filter=low)
  // Response: [ { id, productName, quantity, threshold } ]
  try {
    const low = await fetchJSON('/api/inventory/low');
    const container = document.getElementById('lowStockList');
    container.innerHTML = '';
    if (!Array.isArray(low) || low.length === 0) {
      container.innerHTML = '<div style="padding:8px">No low stock items</div>';
      return;
    }
    low.forEach(item => {
      const div = document.createElement('div');
      div.className = 'low-item';
      div.innerHTML = `<span>${escapeHtml(item.productName)}</span><strong>${item.quantity}</strong>`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Failed to load low stock list', err);
  }
}

async function loadCharts() {
  // Sales trend (daily totals for last 30 days)
  // Expected: GET /api/reports/sales/daily?days=30
  // Response: { labels: ['2025-08-14', ...], data: [120, 80, ...] }
  try {
    const trend = await fetchJSON('/api/reports/sales/daily?days=30');

    const ctx = document.getElementById('salesTrendChart').getContext('2d');
    if (salesTrendChart) salesTrendChart.destroy();
    salesTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.labels,
        datasets: [{
          label: 'Sales (UGX)',
          data: trend.data,
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { maxRotation: 0, autoSkip: true } },
          y: { beginAtZero: true }
        }
      }
    });
  } catch (err) {
    console.error('Failed to load sales trend', err);
  }

  // Stock composition: breakdown by type or top products
  // Expected: GET /api/reports/stock/composition
  // Response: { labels: ['Wood','Furniture'], data: [80,40] }
  try {
    const comp = await fetchJSON('/api/reports/stock/composition');

    const ctx2 = document.getElementById('stockPieChart').getContext('2d');
    if (stockPieChart) stockPieChart.destroy();
    stockPieChart = new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: comp.labels,
        datasets: [{
          data: comp.data,
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error('Failed to load stock composition', err);
  }
}

function formatCurrency(value){
  // Adjust to your currency formatting - here we just show number with commas
  if (value == null) return '';
  return Number(value).toLocaleString();
}

function formatDate(iso){
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString();
}

function escapeHtml(str){
  return String(str).replace(/[&<>"'`]/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'
  })[s]);
}

async function initDashboard() {
  try {
    await loadUser();
    await loadKPIs();
    await loadRecentSales();
    await loadLowStockList();
    await loadCharts();
  } catch (err) {
    console.error('Dashboard initialization error', err);
  }
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) { /* ignore */ }
  window.location.href = '/login.html';
});

window.addEventListener('load', initDashboard);