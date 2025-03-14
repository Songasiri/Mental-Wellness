const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tejasri6372:sri6372@cluster0.awi70.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
