const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

// Admin only routes
router.get("/", auth, adminOnly, userController.getUsers);
router.post("/", auth, adminOnly, userController.createUser);
router.put("/:id/role", auth, adminOnly, userController.updateUserRole);
router.delete("/:id", auth, adminOnly, userController.deleteUser);

module.exports = router;