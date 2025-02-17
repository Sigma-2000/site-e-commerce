const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
//const initializeAdmin = require("./utils/initializeAdmin");

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

mongoose.set("sanitizeFilter", true);

mongoose.connect(mongoUri).then(() => {
  console.log("Base de donnée connectée");
  //initializeAdmin(); TODO Delete that before launch in prod
});

const artworksRoutes = require("./routes/artworks");
const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api", artworksRoutes);
app.use("/api", productsRoutes);
app.use("/api", ordersRoutes);
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
