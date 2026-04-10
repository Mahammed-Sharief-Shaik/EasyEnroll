const express = require('express');
const router = express.Router();
const { enrollCourse, joinWaitlist, dropCourse, getMyEnrollments, getCourseEnrollments } = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Student routes
router.post('/:courseId/enroll', auth, enrollCourse);
router.post('/:courseId/waitlist', auth, joinWaitlist);
router.put('/:courseId/drop', auth, dropCourse);
router.get('/my-enrollments', auth, getMyEnrollments);

// Admin route
router.get('/course/:courseId', auth, admin, getCourseEnrollments);

module.exports = router;
