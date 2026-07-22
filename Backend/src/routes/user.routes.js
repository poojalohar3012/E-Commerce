const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");
const upload = require("../middleware/upload.middleware");

router.get("/profile", protect, userController.getProfile);

router.put(
    "/profile",
    protect,
    upload.single("profileImage"),
    userController.updateProfile
);

module.exports = router;