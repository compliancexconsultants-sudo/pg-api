const PGOwner = require("../models/PGOwner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signupPGOwner = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Check if email already exists
    const existingOwner = await PGOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔐 Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new PGOwner({
      name,
      email,
      phone,
      address,
      gstNumber,
      password: hashedPassword,
    });

    await newOwner.save();

    // ❌ Never send password back
    res.status(201).json({
      message: "PG Owner registered successfully",
      ownerId: newOwner._id,
      email: newOwner.email,
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

    // Create JWT
    const token = jwt.sign(
      { id: owner._id, email: owner.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

