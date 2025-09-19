const form = document.getElementById("customer-form");
const tableBody = document.getElementById("customer-table-body");
const copyright = document.getElementById("copyright");

// Handle customer form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const values = Array.from(form.elements)
    .slice(0, 7)
    .map((input) => input.value);
  const row = document.createElement("tr");

  values.forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  tableBody.appendChild(row);
  form.reset();
});

// // Set current year in footer
// const year = new Date().getFullYear();
// copyright.textContent = `© ${year} Mayondo Wood & Furniture (MWF). All Rights Reserved.`;
