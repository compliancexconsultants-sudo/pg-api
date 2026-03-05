const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addTenant,
  getTenants,
  getTenantById,
  updateTenantStatus,
  updateRentStatus,
} = require("../controllers/tenantController");

router.post("/", auth, addTenant);
router.get("/", auth, getTenants);              // pagination
router.get("/:id", auth, getTenantById);        // single tenant
router.patch("/:id/status", auth, updateTenantStatus);
router.patch("/:id/rent-status", auth, updateRentStatus);

module.exports = router;
