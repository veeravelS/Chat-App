const express = require('express');
const cors = require("cors");
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require("./router/index");
const cookieParser = require('cookie-parser');

const app = express();

// ✅ Fix: Ensure CORS correctly allows credentials
app.use(cors({
   origin: process.env.FRONTEND_URL || "http://localhost:3000",
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// ✅ Fix: Improved server response
app.get('/', (req, res) => {
   res.json({
      message: `Server running at port ${PORT}`,
   });
});

// API endpoints
app.use('/api', router);

// ✅ Fix: Handle DB connection errors properly
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if DB fails
  });
  