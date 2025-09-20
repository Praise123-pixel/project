const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const signupSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    // trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now()
    // required: true,
  },
});

signupSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("UserModel", signupSchema);
