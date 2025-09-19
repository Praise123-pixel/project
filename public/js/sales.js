const form = document.getElementById("salesForm");
const tableBody = document.querySelector("#salesTable tbody");

// Add sales record
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const customer = document.getElementById("customerName").value;
  const product = document.getElementById("productName").value;
  const type = document.getElementById("productType").value;
  const quantity = Number(document.getElementById("quantity").value);
  const date = document.getElementById("saleDate").value;
  const payment = document.getElementById("paymentMethod").value;
  const agent = document.getElementById("salesAgent").value;
  const delivery = document.getElementById("deliveryCheck").checked
    ? (quantity * 0.05).toFixed(2)
    : 0;

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${customer}</td>
        <td>${product}</td>
        <td>${type}</td>
        <td>${quantity}</td>
        <td>${date}</td>
        <td>${payment}</td>
        <td>${agent}</td>
        <td>${delivery}</td>
        <td><button class="delete">Delete</button></td>
      `;
  tableBody.appendChild(row);
  form.reset();
});

// Delete sales record
tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    e.target.closest("tr").remove();
  }
});
