const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', getCourses);
router.get('/:id', getCourseById);

// Admin only routes
router.post('/', auth, admin, createCourse);
router.put('/:id', auth, admin, updateCourse);
router.delete('/:id', auth, admin, deleteCourse);

module.exports = router;
