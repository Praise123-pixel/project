//1.Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");

require("dotenv").config();
const UserModel = require("./models/userModel");
//import routes
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
// const usersRoutes = require("./routes/usersRoutes");

//2.Instantiations
const app = express();
const port = 3500;

//3.Configurations
mongoose.connect(process.env.DATABASE_URL, {});

// setting up mongodb connection
mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");

    // console.log('Hello, World! Node is working...');
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// setting view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//4.Middle ware
//app.use(express.static("public"));  //static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extented: true })); // helps to pass data from forms

// Express session configs
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //One day
  })
);
// passport configs
app.use(passport.initialize());
app.use(passport.session());

// authenticate with passport local strategy
passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// 5.Routes
// Using imported routes
app.use("/", salesRoutes);
app.use("/", authRoutes);
app.use("/", stockRoutes);

//non existent route handler
app.use((req, res) => {
  res.status(404).send("Oops!Route  not found.");
});

//6.Bootstrapping Server
//this should always be the last line in this file.
app.listen(port, () => console.log(`listening on port ${port}`));
