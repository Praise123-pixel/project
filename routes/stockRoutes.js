const express = require("express");
const router = express.Router();
const StockModel = require("../models/stockModel");
const salesModel = require("../models/salesModel");
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

// router.get("/dashboard", (req, res) => {
//   res.render("dashboard", { title: "MWF DASHBOARD" });
// });

// ---------------------- Dashboard ----------------------
router.get("/dashboard", async (req, res) => {
  try {
    // ---------------- KPIs ----------------
    const totalStock = await StockModel.countDocuments() || 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

    const salesToday = await salesModel.countDocuments({ saleDate: { $gte: startOfToday } }) || 0;
    const salesThisMonth = await salesModel.countDocuments({ saleDate: { $gte: startOfMonth } }) || 0;

    const lowStock = await StockModel.find({ quantity: { $lt: 5 } }).sort({ quantity: 1 }) || [];

    // ---------------- Recent Sales ----------------
    const recentSales = await salesModel
      .find()
      .sort({ saleDate: -1 })
      .limit(5)
      .populate("salesAgent", "firstName lastName") || [];

    // ---------------- Sales Trend (last 30 days) ----------------
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0,0,0,0);

    const salesTrendAgg = await salesModel.aggregate([
      { $match: { saleDate: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const salesTrendLabels = [];
    const salesTrendData = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().slice(0, 10);
      salesTrendLabels.push(dateStr);

      const day = salesTrendAgg.find(d => d._id === dateStr);
      salesTrendData.push(day ? day.total : 0);
    }

    // ---------------- Stock Composition ----------------
    const stockCompositionAgg = await StockModel.aggregate([
      { $group: { _id: "$productName", totalQty: { $sum: "$quantity" } } },
    ]);

    const stockCompositionLabels = stockCompositionAgg.map(s => s._id);
    const stockCompositionData = stockCompositionAgg.map(s => s.totalQty);

    // ---------------- Render ----------------
    res.render("dashboard", {
      totalStock,
      salesToday,
      salesThisMonth,
      lowStock,
      recentSales,
      moment,
      salesTrendLabels,
      salesTrendData,
      stockCompositionLabels,
      stockCompositionData,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Unable to fetch data for dashboard.");
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
