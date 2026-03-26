const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roomController = require("../controllers/roomController");

router.post("/add", auth, roomController.addRoom);
router.put("/:id", auth, roomController.updateRoom);
router.delete("/:id", auth, roomController.deleteRoom);
router.get("/:id", auth, roomController.getRoomDetails);
router.get("/", auth, roomController.getRooms);

module.exports = router;