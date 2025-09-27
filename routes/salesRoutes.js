const express = require("express");
const router = express.Router();
const { ensureaunthenticated, ensureAgent,ensureManager } = require("../middleware/auth");
const salesModel = require("../models/salesModel");
const StockModel = require("../models/stockModel");
const moment = require("moment");

// GET Add Sale Form
router.get("/Addsales", ensureaunthenticated, ensureAgent, async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.render("sales", { stocks });
  } catch (error) {
    console.error("Error loading add sales page:", error.message);
    res.redirect("/dashboard");
  }
});

// POST Add Sale
router.post("/Addsales", ensureaunthenticated, ensureAgent, async (req, res) => {
  try {
    const {
      stockId,
      customerName,
      quantity,
      unitPrice,
      saleDate,
      transportCheck,
      paymentMethod,
    } = req.body;

    if (!stockId) return res.status(400).send("No stock selected.");

    const qty = Number(quantity);
    const price = Number(unitPrice);

    // Find stock
    const stock = await StockModel.findById(stockId);
    if (!stock) return res.status(400).send("Stock not found.");

    if (stock.quantity < qty) {
      return res.status(400).send(`Insufficient stock. Only ${stock.quantity} available.`);
    }

    // Calculate total price
    let total = price * qty;
    if (transportCheck === "on") total *= 1.05;

    // Create sale
    const sale = new salesModel({
      customerName,
      productName: stock.productName,
      productType: stock.productType,
      quantity: qty,
      unitPrice: price,
      totalPrice: total.toFixed(2),
      transportCheck: transportCheck === "on",
      paymentMethod,
      salesAgent: req.session.user._id,
      saleDate: new Date(saleDate),
    });

    console.log("Saving sale:", sale);
    await sale.save();

    // Decrease stock quantity
    stock.quantity -= qty;
    await stock.save();

    res.redirect("/saleslist");
  } catch (error) {
    console.error("Error processing sale:", error.message);
    res.redirect("/Addsales");
  }
});

// GET Sales List
router.get("/saleslist", ensureaunthenticated, async (req, res) => {
  try {
    const sales = await salesModel.find().populate("salesAgent", "firstName lastName");
    const currentUser = req.session.user;
    res.render("salestable", { sales, currentUser, moment });
  } catch (error) {
    console.error(error.message);
    res.redirect("/getusers");
  }
});

// GET Edit Sale Form
router.get("/editsales/:id", ensureaunthenticated, ensureManager, async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id);
    if (!sale) return res.status(404).send("Sale not found");
    res.render("editsales", { sale });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error loading edit form");
  }
});

// PUT Update Sale
router.put("/editsales/:id", ensureaunthenticated, ensureManager, async (req, res) => {
  try {
    const {
      customerName,
      productName,
      productType,
      unitPrice,
      quantity,
      saleDate,
      transportCheck,
      paymentMethod,
    } = req.body;

    const qty = Number(quantity);
    const price = Number(unitPrice);

    // Recalculate total price
    let total = price * qty;
    if (transportCheck === "on") total *= 1.05;

    await salesModel.findByIdAndUpdate(req.params.id, {
      customerName,
      productName,
      productType,
      quantity: qty,
      unitPrice: price,
      totalPrice: total.toFixed(2),
      transportCheck: transportCheck === "on",
      paymentMethod,
      saleDate: new Date(saleDate),
    });

    res.redirect("/saleslist");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error updating sale");
  }
});

// POST Delete Sale
router.post("/deletesales", ensureaunthenticated, ensureManager, async (req, res) => {
  try {
    await salesModel.findByIdAndDelete(req.body.id);
    res.redirect("/saleslist");
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Unable to delete sale");
  }
});

// GET Receipt
router.get("/getReceipt/:id", ensureaunthenticated, async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id).populate("salesAgent", "firstName lastName");
    res.render("receipt", { sale, moment });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Unable to find a sale.");
  }
});

module.exports = router;
