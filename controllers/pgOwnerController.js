
const PGOwner = require("../models/PGOwner");
const PG = require("../models/PG");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const QRCode = require("qrcode");
const uploadToImgBB = require("../utils/uploadToImgBB");

exports.signupPGOwner = async (req, res) => {
  try {

    const { name, email, phone, address, password, pgs } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingOwner = await PGOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new PGOwner({
      name,
      email,
      phone,
      address,
      gstNumber: 1,
      password: hashedPassword,
    });

    const savedOwner = await newOwner.save();

    let createdPGs = [];
    let qrurldata

    if (pgs && pgs.length > 0) {

      for (const pg of pgs) {

        // Step 1: Create PG first
        const newPG = new PG({
          ownerId: savedOwner._id,
          name: pg.name,
          totalRooms: pg.totalRooms,
          address: pg.address
        });

        const savedPG = await newPG.save();

        // Step 2: Create QR URL
        const qrLink = `https://pghubform.netlify.app/?owner_id=${savedOwner._id}&pg_id=${savedPG._id}`;

        // Step 3: Generate QR
        const qrBase64 = await QRCode.toDataURL(qrLink);

        const base64Image = qrBase64.replace(/^data:image\/png;base64,/, "");

        // Step 4: Upload QR image
        const qrUrl = await uploadToImgBB(base64Image);

        // Step 5: Save QR URL in PG
        savedPG.qrCode = qrUrl;
        await savedPG.save();
        qrurldata = qrUrl
        createdPGs.push(savedPG);
      }

    }

    await sendEmail(
      email,
      "Welcome to PGHub – Your PG Management Dashboard is Ready",
      `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6fb;padding:30px">
  
    <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      
      <div style="background:#4f6df5;padding:20px;color:white;text-align:center">
        <h1 style="margin:0;font-size:22px">Welcome to PGHub 🎉</h1>
      </div>

      <div style="padding:30px;color:#333">

        <h2 style="margin-top:0">Hello ${name},</h2>

        <p>
          Your <strong>PG Owner account</strong> has been successfully created.
          You can now manage your PG properties, tenants, and rent operations using PGHub.
        </p>

        <div style="background:#f7f9ff;border:1px solid #e3e8ff;padding:20px;border-radius:8px;margin:20px 0">

          <h3 style="margin-top:0;color:#4f6df5">Your Login Credentials</h3>

          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
           <img src="${qrurldata}"/>

        </div>

        <p>
          Please keep your login credentials secure. We recommend changing your password after your first login.
        </p>

        

        <p>
          If you have any questions or need assistance, feel free to contact our support team.
        </p>

        <p>
          Best regards,<br>
          <strong>PGHub Team</strong>
        </p>

      </div>

      <div style="background:#f4f6fb;padding:15px;text-align:center;font-size:12px;color:#777">
        © ${new Date().getFullYear()} PGHub. All rights reserved.
      </div>

    </div>

  </div>
  `
    );

    res.status(201).json({
      message: "PG Owner and PGs registered successfully",
      ownerId: savedOwner._id,
      email: savedOwner.email,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.loginPGOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check user
    const owner = await PGOwner.findOne({ email });
    if (!owner) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Get PGs
    const pgs = await PG.find({ ownerId: owner._id });

    // 🔥 ACCESS TOKEN (short life)
    const accessToken = jwt.sign(
      { id: owner._id, email: owner.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // short
    );
    console.log("🚀 ~ accessToken:", accessToken)

    // 🔥 REFRESH TOKEN (long life)
    const refreshToken = jwt.sign(
      { id: owner._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",

      // 🔥 IMPORTANT CHANGE
      accessToken,
      refreshToken,

      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },

      pgs,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    // 🔥 NEW ACCESS TOKEN
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🔥 ROTATE REFRESH TOKEN (important)
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};