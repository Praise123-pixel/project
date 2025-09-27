const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  transportCheck: {
    type: Boolean,
    required: false,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  saleDate: {
    type: Date,
    required: true,
  },
});
// }, { timestamps: true }); // ✅ Add this option

module.exports = mongoose.model("SalesModel", salesSchema);
