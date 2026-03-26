const Room = require("../models/Room");
const Tenant = require("../models/Tenant");


// ==============================
// ➕ ADD ROOM
// ==============================
exports.addRoom = async (req, res) => {
  try {
    const { room_number, type, capacity, rent_per_bed, pg_id } = req.body;

    const room = new Room({
      owner_id: req.owner_id,
      pg_id,
      room_number,
      type,
      capacity,
      rent_per_bed
    });

    await room.save();

    res.json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ==============================
// ✏️ UPDATE ROOM
// ==============================
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOneAndUpdate(
      { _id: id, owner_id: req.owner_id },
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ==============================
// ❌ DELETE ROOM
// ==============================
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOneAndDelete({
      _id: id,
      owner_id: req.owner_id
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ success: true, message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ==============================
// 👁️ GET SINGLE ROOM
// ==============================
exports.getRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({
      _id: id,
      owner_id: req.owner_id
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // occupancy
    const occupied = await Tenant.countDocuments({
      room_id: room._id,
      status: "active"
    });

    res.json({
      ...room.toObject(),
      occupied,
      available: room.capacity - occupied
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ==============================
// 📋 LIST ROOMS (PAGINATION + SEARCH + OCCUPANCY)
// ==============================
exports.getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 50, pg_id } = req.query;

    const rooms = await Room.find({
      owner_id: req.owner_id,
      pg_id,
    });

    const roomIds = rooms.map(r => r._id);

    const tenantCounts = await Tenant.aggregate([
      {
        $match: {
          room_id: { $in: roomIds },
          status: "active",
        },
      },
      {
        $group: {
          _id: "$room_id",
          count: { $sum: 1 },
        },
      },
    ]);

    const map = {};
    tenantCounts.forEach(t => {
      map[t._id] = t.count;
    });

    const result = rooms.map(r => ({
      ...r.toObject(),
      occupied_beds: map[r._id] || 0,
    }));

    res.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error("Get Rooms Error:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({
      _id: id,
      owner_id: req.owner_id,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const tenants = await Tenant.find({
      room_id: id,
      status: "active",
    });

    res.json({
      success: true,
      data: {
        room,
        tenants,
      },
    });

  } catch (err) {
    console.error("Room Detail Error:", err);
    res.status(500).json({ message: err.message });
  }
};