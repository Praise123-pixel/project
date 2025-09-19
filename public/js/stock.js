const form = document.getElementById("productForm");
const tableBody = document.querySelector("#inventoryTable tbody");

// Add product
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const productData = {
    name: document.getElementById("productName").value,
    type: document.getElementById("productType").value,
    supplier: document.getElementById("supplierName").value,
    cost: Number(document.getElementById("costPrice").value).toLocaleString(),
    price: Number(
      document.getElementById("sellingPrice").value
    ).toLocaleString(),
    qty: document.getElementById("quantity").value,
    color: document.getElementById("color").value,
  };

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${productData.name}</td>
        <td>${productData.type}</td>
        <td>${productData.supplier}</td>
        <td>${productData.cost}</td>
        <td>${productData.price}</td>
        <td>${productData.qty}</td>
        <td>${productData.color}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </td>
      `;

  tableBody.appendChild(row);
  form.reset();
});

// Edit & Delete functionality
tableBody.addEventListener("click", function (e) {
  const row = e.target.closest("tr");
  if (e.target.classList.contains("delete")) {
    row.remove();
  } else if (e.target.classList.contains("edit")) {
    document.getElementById("productName").value = row.cells[0].textContent;
    document.getElementById("productType").value = row.cells[1].textContent;
    document.getElementById("supplierName").value = row.cells[2].textContent;
    document.getElementById("costPrice").value =
      row.cells[3].textContent.replace(/,/g, "");
    document.getElementById("sellingPrice").value =
      row.cells[4].textContent.replace(/,/g, "");
    document.getElementById("quantity").value = row.cells[5].textContent;
    document.getElementById("color").value = row.cells[6].textContent;

    row.remove();
  }
});
