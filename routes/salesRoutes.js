const express = require("express");
const router = express.Router();
const salesModel = require("../models/salesModel");



router.get("/Addsales", (req, res) => {
  res.render("sales");
});









module.exports = router;
