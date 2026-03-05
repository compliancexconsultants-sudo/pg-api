const Payment = require("../models/Payment");
const Tenant = require("../models/Tenant");

/* ================= ADD PAYMENT ================= */
exports.addPayment = async (req, res) => {
  try {
    const {
      tenantId,
      amount,
      type,       // CREDIT / DEBIT
      category,
      month,
      year,
      note,
    } = req.body;

    if (!tenantId || !amount || !type || !month || !year) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const tenant = await Tenant.findOne({
      _id: tenantId,
      ownerId: req.user.id,
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const payment = await Payment.create({
      ownerId: req.user.id,
      tenantId,
      roomNumber: tenant.roomNumber,
      bedNumber: tenant.bedNumber,
      amount,
      type,
      category,
      month,
      year,
      note,
    });

    // 🔥 AUTO UPDATE RENT STATUS
    const credits = await Payment.aggregate([
      {
        $match: {
          tenantId: tenant._id,
          month,
          year,
          type: "CREDIT",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const paid = credits[0]?.total || 0;

    tenant.rentStatus =
      paid >= tenant.monthlyRent ? "PAID" : "PENDING";

    await tenant.save();

    res.status(201).json({
      message: "Payment recorded",
      payment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add payment" });
  }
};

/* ================= TENANT PAYMENT HISTORY ================= */
exports.getTenantPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      tenantId: req.params.tenantId,
      ownerId: req.user.id,
    }).sort({ paymentDate: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/* ================= TENANT MONTHLY STATEMENT ================= */
exports.tenantMonthlyStatement = async (req, res) => {
  try {
    const { month, year } = req.query;

    const payments = await Payment.find({
      tenantId: req.params.id,
      ownerId: req.user.id,
      month: Number(month),
      year: Number(year),
    }).sort({ paymentDate: 1 });

    let credit = 0;
    let debit = 0;

    payments.forEach((p) => {
      if (p.type === "CREDIT") credit += p.amount;
      if (p.type === "DEBIT") debit += p.amount;
    });

    res.json({
      payments,
      summary: {
        credit,
        debit,
        balance: credit - debit,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch statement" });
  }
};

/* ================= OWNER MONTHLY REPORT ================= */
exports.monthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const result = await Payment.aggregate([
      {
        $match: {
          ownerId: req.user._id,
          month: Number(month),
          year: Number(year),
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let credit = 0;
    let debit = 0;

    result.forEach((r) => {
      if (r._id === "CREDIT") credit = r.total;
      if (r._id === "DEBIT") debit = r.total;
    });

    res.json({
      month,
      year,
      credit,
      debit,
      netProfit: credit - debit,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
