const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const routes = require("./routes/index")
const middleware = require("./utils/middleware")
const { default: mongoose } = require("mongoose");

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
// let indexData = [
//   {
//     id: 1,
//     date: "2024-02-14",
//     timestamp: "13:11:12",
//     PM25: 301,
//     CO: 102.4,
//     CO2: 119.5,
//   },
//   {
//     id: 2,
//     date: "2024-02-14",
//     timestamp: "14:11:12",
//     PM25: 229,
//     CO: 147.4,
//     CO2: 87.5,
//   },
//   {
//     id: 3,
//     date: "2024-02-15",
//     timestamp: "12:11:12",
//     PM25: 311,
//     CO: 198.4,
//     CO2: 157.5,
//   },
//   {
//     id: 4,
//     date: "2024-02-15",
//     timestamp: "13:11:12",
//     PM25: 231,
//     CO: 165.4,
//     CO2: 232.5,
//   },
// ];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World</h1>");
// });

// app.get("/api", (request, response) => {
//   response.json(indexData);
// });

// app.get("/api/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const value = indexData.find((value) => value.id === id);
//   if (value) {
//     response.json(value);
//   } else {
//     response.status(404).end();
//   }
// });

// app.delete("/api/:id", (request, response) => {
//   const id = Number(request.params.id);
//   indexData = indexData.filter((value) => value.id !== id);
//   response.status(204).end();
// });

// const generateID = () => {
//   const maxID =
//     indexData.length > 0 ? Math.max(...indexData.map((n) => n.id)) : 0;
//   return maxID + 1;
// };

// app.post("/api", (request, response) => {
//   const { PM25, CO, CO2 } = request.body;
//   const newIndexData = {
//     id: generateID(),
//     PM25,
//     CO,
//     CO2,
//   };
//   indexData = indexData.concat(newIndexData);
//   console.log(indexData);
//   response.json(indexData);
// });

// app.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`);
// });