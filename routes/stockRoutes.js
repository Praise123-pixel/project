const express = require("express");
const router = express.Router();
const stockModel = require("../models/stockModel");


router.get("/Addstock", (req, res) => {
  res.render("stock");
});
































module.exports = router;
