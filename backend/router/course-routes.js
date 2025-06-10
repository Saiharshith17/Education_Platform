const express = require("express");
const router = express.Router();
const { getAllCourses } = require("../controllers/course-controller");

router.get("/courses", getAllCourses);

module.exports = router;
