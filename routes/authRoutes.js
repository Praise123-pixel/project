const express = require("express");
const router = express.Router();
const passport = require("passport");
const StockModel = require("../models/stockModel");
const UserModel = require("../models/userModel");
const userModel = require("../models/userModel");
const moment = require("moment");

//getting the form page
router.get("/", (req, res) => {
  res.render("index", { title: "WELCOME TO MWF" });
});

router.get("/logout", (req, res) => {
  res.render("logout", { title: "LOGOUT" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "SIGN UP" });
});

router.post("/signup", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    console.log(req.body);
    let existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("Already registered email");
    } else {
      await UserModel.register(user, req.body.password, (error) => {
        if (error) {
          throw error;
        }
        res.redirect("/login");
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Try again");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { title: "LOGIN" });
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      req.session.user = req.user;
      if (req.user.role === "manager") {
        res.redirect("/dashboard");
      } else if (req.user.role === "salesAgent") {
        res.redirect("/Addsales");
      } else {
        res.render("noneuser");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Error Logging In");
    }
  }
);

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "MWF DASHBOARD" });
});

router.get("/getusers", async (req, res) => {
  try {
    const users = await UserModel.find().sort({ $natural: -1 });
    res.render("users", { users, moment });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Users not found");
  }
});

module.exports = router;
