const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController");

router.post(
  "/scan",
  menuController.scanCustomerMenu
);

router.get(
  "/:sessionId",
  menuController.getCustomerMenu
);


module.exports = router;
