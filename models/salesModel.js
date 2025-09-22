const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"UserModel",
    required: true
  },
  transportCheck: {
    type: Boolean,
  },
});  
// }, { timestamps: true }); // ✅ Add this option

module.exports = mongoose.model('salesModel', salesSchema);
