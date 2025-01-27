const express = require("express");
const { registerUser, loginUser, getProfile } = require("./controllers");
const { protect } = require("./middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;
