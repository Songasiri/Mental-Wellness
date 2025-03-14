const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const nodemailer = require("nodemailer");

connectDB();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/user", userRoutes);

// Email sending route
app.post("/send-mail", async (req, res) => {
  const { userInput, guardianEmails, name } = req.body;

  if (!guardianEmails || guardianEmails.length === 0) {
    return res.status(400).json({ message: "No guardian emails provided." });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mentalwellnessbot@gmail.com",
      pass: "jgmp rpoi mckn ipfx", // Use an App Password instead
    },
    tls: {
      rejectUnauthorized: false, // Allows self-signed certificates
    },
  });
  

  const mailOptions = {
    from: "mentalwellnessbot@gmail.com",
    to: guardianEmails, // Sending to multiple recipients
    subject: "Urgent: Mental Health Alert",
    text: `A user named ${name} expressed concerning thoughts: "${userInput}". Please reach out to them immediately.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Alert email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
