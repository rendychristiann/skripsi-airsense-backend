const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/indexControllers');
const indexRoutes = require("./indexRouters");

router.get("/info", indexControllers.info);
router.get("/", (request, response) => {
    response.send('<h1>Hello World!</h1>')
});

router.use("/api", indexRoutes);
module.exports = router;