require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);
const user = require("./models/user.model");

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.get("/", (req, res) => {
  res.json({
    msg: "hello world",
  });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res.status(400).json({
      error: true,
      message: "Full Name is required",
    });
  }
  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      error: true,
      message: "Password is required",
    });
  }

  const isUser = await user.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      msg: "User Already exist",
    });
  }

  const newUser = new user({ fullName, email, password });
  await newUser.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    newUser,
    accessToken,
    message: "Registration Successful",
  });
});

app.listen(3000);
module.exports = app;
