const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const auth = require("../../middleware/auth");

// const passport = require("passport");

// Load Model
const User = require("../../models/User");

// // Load Validation
// const validatePostInput = require("../../validation/post";

// @route   GET api/auth/test
// @desc    Tests auth route
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Auth works"
  });
});

// @route   POST api/auth/
// @desc    Authenticate user
// @access  public
router.post("/", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (!user)
      return res
        .status(400)
        .json({ errors: [{ message: "Email and/or password is incorrect." }] });
    // Compare Password with Bcryptjs Hashed
    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({
          errors: [{ message: "Email and/or password is incorrect." }]
        });

      // Remove user password from user object
      user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      };

      // Create json web token: payload is new user
      jwt.sign(user, keys.jwtSecret, { expiresIn: "3d" }, (error, token) => {
        // Once jwt is signed, run code
        if (error) throw error;
        res.json({ token: token, user });
      });
    });
  });
});

// @route   GET api/auth/user
// @desc    Get User route
// @access  Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => {
      res.json(user);
    })
    .catch(error =>
      res.json({ errors: [{ message: "Email and/or password is incorrect." }] })
    );
});

module.exports = router;