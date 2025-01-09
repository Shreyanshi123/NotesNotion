const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Life goes on- Like an echo in the forest";
const fetchuser = require("../middleware/fetchuser");

//
// can use router now
// creating a user post api/auth/createuser -- no authentication required
//validation
//one
router.post(
  "/createuser",
  [
    //user validation added
    body("email", "enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("password", "password length min 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // case of errors present
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // creation of user
    // check point whether user email exists already -- email is unique
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(404).json({success:false, error: "User already exists" });
      }
      // generation of salt here
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      // signing the token with ur jwt secret token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success= true;
      res.json({success, authToken });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({success, message: "error occurred in auth controller create user" });
    }
  }
);
// two
// authenticate the login api/auth/login
router.post(
  "/login",
  [body("email", "enter a valid email").isEmail()],
  [body("password", "password cannot be empty").exists()],
  async (req, res) => {
    let  success = false;
    // check the error if present in email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // user find in the database check
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Try to login with correct credentials" });
      }
      // compare the password
      // internally matches the stored hashed return true or false
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        
        return res
          .status(404)
          .json({success, error: "Try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,authToken });
    } catch (error) {
      res.status(500).json({ message: "Internal Server error" });
    }
  }
);

// route 3 logged in user data
// get user detail endpoint api/auth/getuser -- login required
// decode the auth token we get
router.post("/getuser",fetchuser, async (req, res) => {
  try {
    const userId =req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Internal server error");
  }
});
module.exports = router;
