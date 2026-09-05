const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
  "/",
  auth,
  roleMiddleware("manager"),
  userController.getUsers
);

router.post(
  "/",
  auth,
  roleMiddleware("manager"),
  userController.createUser
);

router.put(
  "/:id/role",
  auth,
  roleMiddleware("manager"),
  userController.updateUserRole
);

router.delete(
  "/:id",
  auth,
  roleMiddleware("manager"),
  userController.deleteUser
);

module.exports = router;