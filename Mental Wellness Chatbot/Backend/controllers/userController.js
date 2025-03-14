const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Sign Up
exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single User
exports.getSingleUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Guardian
exports.addGuardian = async (req, res) => {
  try {
    const { userId, name, email, relation } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.guardians.push({ name, email, relation });
    await user.save();

    res.status(200).json({
      message: "Guardian added successfully",
      guardians: user.guardians,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Guardian
exports.deleteGuardian = async (req, res) => {
  try {
    const { userId, guardianId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.guardians = user.guardians.filter(
      (g) => g._id.toString() !== guardianId
    );
    await user.save();

    res.status(200).json({
      message: "Guardian deleted successfully",
      guardians: user.guardians,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
