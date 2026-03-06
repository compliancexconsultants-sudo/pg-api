const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");

const generateTenantReceipt = (data) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    const receiptNo = "INV-" + uuidv4().slice(0, 8).toUpperCase();
    const date = new Date().toLocaleDateString();

    /* ---------- HEADER ---------- */

    doc
      .fontSize(26)
      .fillColor("#4F46E5")
      .text("MyPGHubX", 50, 50);

    doc
      .fontSize(18)
      .fillColor("#111")
      .text("Tenant Payment Invoice", 350, 55);

    doc
      .fontSize(10)
      .fillColor("#444")
      .text(`Invoice No: ${receiptNo}`, 350, 80)
      .text(`Date: ${date}`, 350, 95);

    doc.moveDown(3);

    /* ---------- OWNER DETAILS ---------- */

    doc
      .fontSize(12)
      .fillColor("#4F46E5")
      .text("Owner Details", 50, 130);

    /* ---------- TENANT DETAILS ---------- */

    doc
      .fontSize(12)
      .fillColor("#4F46E5")
      .text("Tenant Details", 350, 130);

    doc
      .fontSize(10)
      .fillColor("#111")
      .text(`Name: ${data.tenantName}`, 350, 150)
      .text(`Email: ${data.tenantEmail}`, 350, 165)
      .text(`Phone: ${data.phone}`, 350, 180);

    doc.moveDown(4);

    /* ---------- PROPERTY DETAILS ---------- */

    doc
      .fontSize(12)
      .fillColor("#4F46E5")
      .text("PG Details", 50, 220);

    doc
      .fontSize(10)
      .fillColor("#111")
      .text(`PG Name: ${data.pgName}`, 50, 240)
      .text(`Room Number: ${data.roomNumber}`, 50, 255)
      .text(`Move-in Date: ${data.moveInDate}`, 50, 270);

    /* ---------- TABLE HEADER ---------- */

    const tableTop = 320;

    doc
      .fontSize(11)
      .fillColor("#fff")
      .rect(50, tableTop, 500, 25)
      .fill("#4F46E5");

    doc
      .fillColor("#fff")
      .text("Description", 60, tableTop + 7)
      .text("Amount (₹)", 450, tableTop + 7);

    /* ---------- TABLE ROWS ---------- */

    const row1 = tableTop + 30;

    doc
      .fillColor("#111")
      .fontSize(10)
      .text("Advance Payment", 60, row1)
      .text(`₹ ${data.advance}`, 450, row1);

    const row2 = row1 + 25;

    doc
      .text("Monthly Rent", 60, row2)
      .text(`₹ ${data.rent}`, 450, row2);

    /* ---------- TOTAL ---------- */

    const totalY = row2 + 40;

    doc
      .fontSize(12)
      .fillColor("#000")
      .text("Total Paid", 350, totalY)
      .text(`₹ ${data.advance + data.rent}`, 450, totalY);

    /* ---------- FOOTER ---------- */

    doc
      .fontSize(10)
      .fillColor("#777")
      .text(
        "This is a system generated receipt from MyPGHubX PG Management Platform.",
        50,
        650,
        { align: "center", width: 500 }
      );

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        "For any billing queries please contact the PG owner.",
        { align: "center" }
      );

    doc.end();
  });
};

module.exports = generateTenantReceipt;