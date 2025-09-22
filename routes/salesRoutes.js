const express = require("express");
const router = express.Router();
const { ensureaunthenticated, ensureAgent } = require("../middleware/auth");
const salesModel = require("../models/salesModel");

router.get("/Addsales", (req, res) => {
  res.render("sales");
});

router.post(
  "/Addsales",
  ensureaunthenticated,
  ensureAgent,
  async (req, res) => {
    try {
      const {
        customerName,
        productName,
        productType,
        unitPrice,
        quantity,
        saleDate,
        paymentMethod,
        transportCheck,
      } = req.body;
      const userId = req.session.user._id;

      const sale = new salesModel({
        customerName,
        productName,
        productType,
        unitPrice,
        quantity,
        saleDate,
        paymentMethod,
        salesAgent: userId,
        transportCheck,
      });
      console.log(userId);
      await sale.save();
      res.redirect("/saleslist");
    } catch (error) {
      console.error(error.message);
      res.redirect("/Addsales");
    }
  }
);

router.get("/saleslist", async (req, res) => {
  try {
    //sales agent only sees their own sales
    const sales = await salesModel
      .find()
      .populate("salesAgent", "firstName lastName");
    const currentUser = req.session.user
    console.log(currentUser);
    res.render("salestable", { sales, currentUser });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

module.exports = router;
