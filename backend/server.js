const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
require("dotenv").config();
const path = require("path");

const fs = require("fs");
const swaggerUi = require("swagger-ui-express");

const swaggerFile = JSON.parse(
  fs.readFileSync("./swagger/output.json", "utf8")
);

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// CORS
app.use(
  cors({
    origin: "http://178.236.246.165:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error);
  }
})();
