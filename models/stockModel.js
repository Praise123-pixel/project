const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  measurements: {
    type: Number,
    required: true,
    // unique: true,
    // trim: true
  },
  datebought: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("StockModel", stockSchema);
