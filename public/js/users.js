document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/users"); // ✅ Make sure this endpoint returns all users
    const users = await response.json();

    const tbody = document.getElementById("users-table-body");
    tbody.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.role || "N/A"}</td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading users:", error);
  }
});
