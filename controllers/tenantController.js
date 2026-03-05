const Tenant = require("../models/Tenant");
const uploadToImgBB = require("../utils/uploadToImgBB");
const Room = require("../models/Room");


/**
 * ADD TENANT + UPDATE ROOM/BED
 */
exports.addTenant = async (req, res) => {
  try {
    let {
      name,
      aadharNumber,
      referenceContact,
      permanentAddress,
      occupation,
      occupationAddress,
      roomId,       
      bedNumber,
      monthlyRent,
      advanceAmount,
      rentDueDay,
      contactnumber,
      aadharCardPhoto,
      userPhoto,
    } = req.body;

    /* ================= UPLOAD IMAGES ================= */
    if (aadharCardPhoto) {
      aadharCardPhoto = await uploadToImgBB(aadharCardPhoto);
    }
    if (userPhoto) {
      userPhoto = await uploadToImgBB(userPhoto);
    }

    /* ================= FIND ROOM ================= */
    const room = await Room.findOne({
      _id: roomId,
      ownerId: req.user.id,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    /* ================= FIND BED ================= */
    const bed = room.beds.find((b) => b.bedNumber === bedNumber);

    if (!bed) {
      return res.status(400).json({ message: "Invalid bed number" });
    }

    if (bed.isOccupied) {
      return res.status(400).json({ message: "Bed already occupied" });
    }

    /* ================= CREATE TENANT ================= */
    const tenant = new Tenant({
      ownerId: req.user.id,
      name,
      aadharNumber,
      referenceContact,
      permanentAddress,
      occupation,
      occupationAddress,

      roomNumber: room.roomNumber,
      bedNumber,

      monthlyRent,
      advanceAmount,
      rentDueDay,
      contactnumber,

      aadharCardPhoto,
      userPhoto,
    });

    await tenant.save();

    /* ================= UPDATE BED ================= */
    bed.isOccupied = true;
    bed.tenantId = tenant._id;

    /* ================= UPDATE ROOM STATUS ================= */
    const occupiedBeds = room.beds.filter((b) => b.isOccupied).length;

    room.status =
      occupiedBeds === room.beds.length
        ? "OCCUPIED"
        : "PARTIALLY_OCCUPIED";

    await room.save();

    /* ================= DONE ================= */
    res.status(201).json({
      message: "Tenant added & bed assigned successfully",
      tenant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add tenant" });
  }
};


/**
 * GET TENANTS (PAGINATED)
 * ?page=1
 */
exports.getTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    // 🔥 NEW: STATUS FILTER SUPPORT
    const statusQuery = req.query.status;
    const filter = { ownerId: req.user.id };

    if (statusQuery) {
      const statuses = statusQuery.split(","); // "ACTIVE,NOTICE_PERIOD"
      filter.status = { $in: statuses };
    }

    const [tenants, total] = await Promise.all([
      Tenant.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Tenant.countDocuments(filter),
    ]);

    res.json({
      tenants,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tenants" });
  }
};


/**
 * GET SINGLE TENANT DETAILS
 */
exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tenant" });
  }
};

/**
 * UPDATE TENANT STATUS
 */
exports.updateTenantStatus = async (req, res) => {
  const { status } = req.body;

  if (!["ACTIVE", "NOTICE_PERIOD", "VACATED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const tenant = await Tenant.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json({ message: "Tenant status updated", tenant });
};

/**
 * UPDATE RENT STATUS
 */
exports.updateRentStatus = async (req, res) => {
  const { rentStatus } = req.body;

  if (!["PAID", "PENDING", "OVERDUE"].includes(rentStatus)) {
    return res.status(400).json({ message: "Invalid rent status" });
  }

  const tenant = await Tenant.findByIdAndUpdate(
    req.params.id,
    { rentStatus },
    { new: true }
  );

  res.json({ message: "Rent status updated", tenant });
};
