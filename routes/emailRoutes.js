const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/emailcontroller");

router.post("/tenant-add", auth, controller.addTenant);

module.exports = router;
