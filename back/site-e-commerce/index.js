const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri).then(() => {
  console.log("Base de donnée connectée");
});

const artworksRoutes = require("./routes/artworks");
const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");
//const authRoutes = require("./routes/auth");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", artworksRoutes);
app.use("/api", productsRoutes);
app.use("/api", ordersRoutes);
//app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
