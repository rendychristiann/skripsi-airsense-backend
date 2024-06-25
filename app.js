const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const routes = require("./routes/index")
const middleware = require("./utils/middleware")
const { default: mongoose } = require("mongoose");
require('dotenv').config();

const app = express();

mongoose.set("strictQuery", false);
logger.info("Connecting to: ", config.MONGODB_URL);
mongoose.connect(config.MONGODB_URL).then(() => {
  logger.info("Connected to MongoDB");
})
.catch((error) => {
    logger.error("Error connecting to MongoDB", error.message)
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));

app.use("/", routes);
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint);
module.exports = app;
