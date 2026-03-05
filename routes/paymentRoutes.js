const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/paymentController");

router.post("/", auth, controller.addPayment);

router.get(
  "/tenant/:tenantId",
  auth,
  controller.getTenantPayments
);

router.get(
  "/tenant/:id/statement",
  auth,
  controller.tenantMonthlyStatement
);

router.get(
  "/report/monthly",
  auth,
  controller.monthlyReport
);

module.exports = router;
