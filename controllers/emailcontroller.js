const sendMail = require("../utils/sendEmail");
const generateReceipt = require("../utils/generateTenantReceipt");
const {
  tenantReceiptEmail,
  ownerTenantAdded,
} = require("../utils/emailTemplates");

exports.addTenant = async (req, res) => {
  try {
    const {
      tenantName,
      tenantEmail,
      phone,
      pgName,
      roomNumber,
      advance,
      rent,
      moveInDate,
    } = req.body;

    const ownerEmail = req.user.email;

    const tenantData = {
      tenantName,
      tenantEmail,
      phone,
      pgName,
      roomNumber,
      advance,
      rent,
      moveInDate,
    };

    // Generate professional receipt
    const pdfBuffer = await generateReceipt(tenantData);

    // Send receipt to tenant
    await sendMail(
      tenantEmail,
      "PG Payment Receipt",
      tenantReceiptEmail(tenantName, pgName),
      pdfBuffer
    );

    // Notify owner
    await sendMail(
      ownerEmail,
      "New Tenant Registered",
      ownerTenantAdded(tenantName, tenantEmail, pgName)
    );

    res.json({
      message: "Tenant added and receipt sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error processing tenant registration",
    });
  }
};