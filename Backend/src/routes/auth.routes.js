const express = require("express");

const router = express.Router();
const { protect, authorize} = require("../middleware/auth.middleware");


const authController = require("../controllers/auth/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to your profile",
    user: req.user,
  });
});

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin",
    });

  }
);

module.exports = router;