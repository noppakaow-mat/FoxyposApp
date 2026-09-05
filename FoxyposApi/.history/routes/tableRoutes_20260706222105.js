const express = require("express");
const router = express.Router();

const {
    getTables,
    openTable
} = require("../controllers/tableController");

router.get("/", getTables);
router.post("/open", openTable);

module.exports = router;