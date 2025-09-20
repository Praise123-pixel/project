const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  producttype: {
    type: String,
    required: true
  },
  productname: {
    type: Array,
    required: true
  },
  customername: {
    type: String,
    required: true
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  transportCheck: {
    type: Boolean,
    required: false,
  },
  paymenttype: {
    type: String,
    required: true
  },
}, { timestamps: true }); // ✅ Add this option

module.exports = mongoose.model('salesModel', salesSchema);
