const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  bedNumber: String,
  isOccupied: {
    type: Boolean,
    default: false,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    default: null,
  },
});

const roomSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PgOwner",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["SINGLE", "DOUBLE", "TRIPLE"],
      required: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
    },

    beds: [bedSchema],

    status: {
      type: String,
      enum: ["VACANT", "PARTIALLY_OCCUPIED", "OCCUPIED"],
      default: "VACANT",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
