const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const settingsController = require("../controllers/settingsController");

router.get("/", authenticateToken, settingsController.getSettings);
router.post("/", authenticateToken, settingsController.saveSettings);

module.exports = router;
