const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.get("/", authenticateToken, transactionController.getTransactions);
router.post("/", authenticateToken, transactionController.createTransaction);
router.put("/:id", authenticateToken, transactionController.updateTransaction);

module.exports = router;
