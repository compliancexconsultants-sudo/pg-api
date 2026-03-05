const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const auth = require("../middleware/auth");

// 🔐 Protected routes
router.post("/", auth, roomController.createRoom);
router.get("/", auth, roomController.getRooms);
router.get("/:id", auth, roomController.getRoomDetails);

router.put("/:id", auth, roomController.updateRoom);
router.delete("/:id", auth, roomController.deleteRoom);

// 🛏 Bed / Tenant management
router.post("/:roomId/assign-bed", auth, roomController.assignTenantToBed);
router.post("/:roomId/vacate-bed", auth, roomController.vacateBed);

module.exports = router;
