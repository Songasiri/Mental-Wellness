const mongoose = require("mongoose");

const GuardianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  relation: { type: String, required: true }, // e.g., Father, Mother, Uncle, etc.
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    guardians: { type: [GuardianSchema], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
