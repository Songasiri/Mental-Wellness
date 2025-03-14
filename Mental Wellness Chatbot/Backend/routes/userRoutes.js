const express = require("express");
const {
  signUp,
  login,
  getSingleUser,
  addGuardian,
  deleteGuardian,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/getUser", getSingleUser);
router.post("/addGuardian", addGuardian);
router.post("/deleteGuardian", deleteGuardian);

module.exports = router;
