const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");
const SalesModel = require("../models/salesModel");
const mongoose = require("mongoose");
const moment = require("moment");

// ---------------------- Add Stock ----------------------
router.get("/Addstock", (req, res) => {
  res.render("stock");
});

router.post("/Addstock", async (req, res) => {
  try {
    const stock = new StockModel(req.body);
    await stock.save();
    console.log("Stock saved:", stock);
    res.redirect("/stocklist");
  } catch (error) {
    console.log(error);
    res.redirect("/Addstock");
  }
});

// ---------------------- Dashboard ----------------------
router.get("/dashboard", async (req, res) => {
  try {
    // Aggregate expenses and revenue
    const totalExpensePoles = await StockModel.aggregate([
      { $match: { productName: "Poles" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    const totalExpenseTables = await StockModel.aggregate([
      { $match: { productName: "Tables" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    const totalExpenseTimber = await StockModel.aggregate([
      { $match: { productName: "Timber" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    const totalRevenue = await SalesModel.aggregate([
      {
        $group: {
          _id: "$producttype",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.render("dashboard", {
      totalExpensePoles: totalExpensePoles[0] || {
        totalQuantity: 0,
        totalCost: 0,
      },
      totalExpenseTimber: totalExpenseTimber[0] || {
        totalQuantity: 0,
        totalCost: 0,
      },
      totalRevenue: totalRevenue[0] || { totalQuantity: 0, totalRevenue: 0 },
    });
  } catch (error) {
    console.error("Aggregation Error:", error.message);
    res.status(400).send("Unable to fetch data for dashboard.");
  }
});

// ---------------------- Stock List ----------------------
router.get("/stocklist", async (req, res) => {
  try {
    const items = await StockModel.find().sort({ $natural: -1 });
    res.render("stocktable", { items, moment });
  } catch (error) {
    console.log("Error fetching items:", error.message);
    res.status(400).send("Unable to get data from the database.");
  }
});

// ---------------------- Edit Stock ----------------------

// GET Edit form
router.get("/editstock/:id", async (req, res) => {
  try {
    const item = await StockModel.findById(req.params.id);
    if (!item) return res.status(404).send("Product not found");
    res.render("editstock", { item });
  } catch (error) {
    console.error("Error loading edit form:", error.message);
    res.status(500).send("Error loading edit form");
  }
});

// PUT - Update stock
router.put("/editstock/:id", async (req, res) => {
  try {
    const updatedProduct = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).send("Product not found");

    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).send("Error updating product");
  }
});

// ---------------------- Delete Stock ----------------------
router.post("/deletestock", async (req, res) => {
  try {
    await StockModel.deleteOne({ _id: req.body.id });
    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error deleting stock:", error.message);
    res.status(400).send("Unable to delete item from the database.");
  }
});

module.exports = router;
