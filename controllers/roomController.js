const Room = require("../models/Room");
const Tenant = require("../models/Tenant");

/* ================= CREATE ROOM ================= */
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, monthlyRent, totalBeds } = req.body;

    const beds = Array.from({ length: totalBeds }).map((_, i) => ({
      bedNumber: `B${i + 1}`,
    }));

    const room = await Room.create({
      ownerId: req.user.id,
      roomNumber,
      roomType,
      monthlyRent,
      beds,
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Failed to create room" });
  }
};

/* ================= GET ALL ROOMS ================= */
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ ownerId: req.user.id })
      .sort({ roomNumber: 1 });

    const formatted = rooms.map((room) => {
      const occupied = room.beds.filter((b) => b.isOccupied).length;

      return {
        _id: room._id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        totalBeds: room.beds.length,
        vacantBeds: room.beds.length - occupied,
        status: room.status,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

/* ================= ROOM DETAILS ================= */
/* ================= ROOM DETAILS ================= */
exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    }).populate({
      path: "beds.tenantId",
      select:
        "name contactnumber referenceContact rentStatus status userPhoto monthlyRent",
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const totalBeds = room.beds.length;
    const occupiedBeds = room.beds.filter((b) => b.isOccupied).length;

    // 🔥 EXTRACT TENANTS FROM BEDS
    const tenants = room.beds
      .filter((b) => b.tenantId)
      .map((b) => ({
        _id: b.tenantId._id,
        name: b.tenantId.name,
        phone: b.tenantId.contactnumber,
        referenceContact: b.tenantId.referenceContact,
        rentStatus: b.tenantId.rentStatus,
        status: b.tenantId.status,
        monthlyRent: b.tenantId.monthlyRent,
        bedNumber: b.bedNumber,
        userPhoto: b.tenantId.userPhoto,
      }));

    res.json({
      _id: room._id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      monthlyRent: room.monthlyRent,
      status: room.status,

      totalBeds,
      occupiedBeds,
      vacantBeds: totalBeds - occupiedBeds,

      beds: room.beds,
      tenants, // ✅ FINAL TENANTS ARRAY
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch room details" });
  }
};


/* ================= UPDATE ROOM ================= */
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: "Failed to update room" });
  }
};

/* ================= DELETE ROOM ================= */
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete room" });
  }
};

/* ================= ASSIGN TENANT TO BED ================= */
exports.assignTenantToBed = async (req, res) => {
  try {
    const { tenantId, bedNumber } = req.body;

    const room = await Room.findOne({
      _id: req.params.roomId,
      ownerId: req.user.id,
    });

    const bed = room.beds.find((b) => b.bedNumber === bedNumber);

    if (!bed || bed.isOccupied) {
      return res.status(400).json({ message: "Bed not available" });
    }

    bed.isOccupied = true;
    bed.tenantId = tenantId;

    // update room status
    const occupied = room.beds.filter((b) => b.isOccupied).length;
    room.status =
      occupied === room.beds.length
        ? "OCCUPIED"
        : "PARTIALLY_OCCUPIED";

    await room.save();

    // update tenant room info
    await Tenant.findByIdAndUpdate(tenantId, {
      roomNumber: room.roomNumber,
      bedNumber,
    });

    res.json({ message: "Tenant assigned to bed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign bed" });
  }
};

/* ================= VACATE BED ================= */
exports.vacateBed = async (req, res) => {
  try {
    const { bedNumber } = req.body;

    const room = await Room.findOne({
      _id: req.params.roomId,
      ownerId: req.user.id,
    });

    const bed = room.beds.find((b) => b.bedNumber === bedNumber);

    bed.isOccupied = false;
    bed.tenantId = null;

    const occupied = room.beds.filter((b) => b.isOccupied).length;
    room.status = occupied === 0 ? "VACANT" : "PARTIALLY_OCCUPIED";

    await room.save();

    res.json({ message: "Bed vacated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to vacate bed" });
  }
};
