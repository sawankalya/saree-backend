require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 5000;


const app = express();
app.use(cors());

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/sarees", require("./routes/sareeRoutes"));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
