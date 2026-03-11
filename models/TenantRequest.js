const mongoose = require("mongoose");

const tenantRequestSchema = new mongoose.Schema(
{
ownerId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

pgId: {
type: mongoose.Schema.Types.ObjectId,
ref: "PG",
required: true,
},

name: {
type: String,
required: true,
},

phone: {
type: String,
required: true,
},

altPhone: String,

email: {
type: String,
required: true,
},

aadhaar: {
type: String,
required: true,
},

address: {
type: String,
required: true,
},

occupation: {
type: String,
required: true,
},

occupationAddress: {
type: String,
required: true,
},

aadhaarPhoto: {
type: String,
},

passportPhoto: {
type: String,
},

status: {
type: String,
enum: ["PENDING", "APPROVED", "REJECTED"],
default: "PENDING",
},

},
{ timestamps: true }
);

module.exports = mongoose.model("TenantRequest", tenantRequestSchema);