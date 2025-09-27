// const form = document.getElementById("salesForm");
// const tableBody = document.querySelector("#salesTable tbody");

// // Add sales record
// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   const customer = document.getElementById("customerName").value;
//   const product = document.getElementById("productName").value;
//   const type = document.getElementById("productType").value;
//   const quantity = Number(document.getElementById("quantity").value);
//   const date = document.getElementById("saleDate").value;
//   const payment = document.getElementById("paymentMethod").value;
//   const agent = document.getElementById("salesAgent").value;
//   const delivery = document.getElementById("deliveryCheck").checked
//     ? (quantity * 0.05).toFixed(2)
//     : 0;

//   const row = document.createElement("tr");
//   row.innerHTML = `
//         <td>${customer}</td>
//         <td>${product}</td>
//         <td>${type}</td>
//         <td>${quantity}</td>
//         <td>${date}</td>
//         <td>${payment}</td>
//         <td>${agent}</td>
//         <td>${delivery}</td>
//         <td><button class="delete">Delete</button></td>
//       `;
//   tableBody.appendChild(row);
//   form.reset();
// });

// // Delete sales record
// tableBody.addEventListener("click", function (e) {
//   if (e.target.classList.contains("delete")) {
//     e.target.closest("tr").remove();
//   }
// });

// //- Script to auto-calculate total price
// script
//   const qtyInput = document.getElementById('quantity');
//   const priceInput = document.getElementById('unitPrice');
//   const totalInput = document.getElementById('totalPrice');
//   const transport = document.getElementById('transportfee');

//   function calculateTotal() {
//     const qty = Number(qtyInput.value) || 0;
//     const price = Number(priceInput.value) || 0;
//     let total = qty * price;
//     if (transport.checked) total *= 1.05;
//     totalInput.value = total.toFixed(2);
//   }

//   qtyInput.addEventListener('input', calculateTotal);
//   priceInput.addEventListener('input', calculateTotal);
//   transport.addEventListener('change', calculateTotal);

// document.getElementById("unitPrice").addEventListener("change",function(){
//     const unitPrice = parseFloat(document.getElementById("unitPrice").value)
//     const quantity = parseFloat(document.getElementById("quantity").value)
//     const totalPrice = document.getElementById("totalPrice")
//     if(!isNaN(quantity) && !isNaN(unitPrice)){
//         const totalCoast = (quantity * unitPrice).toFixed(0);
//         totalPrice.value = totalCoast
//     }else{
//         totalPrice.value = ""
//     }
// })

function calculateTotal() {
  const unitPrice = parseFloat(document.getElementById("unitPrice").value);
  const quantity = parseFloat(document.getElementById("quantity").value);
  const transportFee = document.getElementById("transportfee").checked;
  const totalPriceField = document.getElementById("totalPrice");

  if (!isNaN(quantity) && !isNaN(unitPrice)) {
    let total = quantity * unitPrice;
    if (transportFee) total *= 1.05; // Add 5% transport fee if checked
    totalPriceField.value = total.toFixed(0);
  } else {
    totalPriceField.value = "";
  }
}

// Attach event listeners
document.getElementById("unitPrice").addEventListener("input", calculateTotal);
document.getElementById("quantity").addEventListener("input", calculateTotal);
document
  .getElementById("transportfee")
  .addEventListener("change", calculateTotal);
