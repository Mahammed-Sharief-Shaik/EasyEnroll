const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ message: 'Course is full. Please join the waitlist.' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
      status: 'enrolled'
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const newEnrollment = new Enrollment({
      student: req.user.id,
      course: req.params.courseId
    });

    await newEnrollment.save();
    course.enrolledCount += 1;

    // If user was on waitlist, remove them
    if (course.waitlist.includes(req.user.id)) {
      course.waitlist = course.waitlist.filter(id => id.toString() !== req.user.id.toString());
    }

    await course.save();
    res.status(201).json(newEnrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.joinWaitlist = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.waitlist.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already on the waitlist for this course' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
      status: 'enrolled'
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled, cannot join waitlist' });
    }

    course.waitlist.push(req.user.id);
    await course.save();

    res.status(200).json({ message: 'Successfully joined the waitlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
      status: 'enrolled'
    });

    if (!enrollment) return res.status(404).json({ message: 'Active enrollment not found' });

    enrollment.status = 'dropped';
    await enrollment.save();

    const course = await Course.findById(req.params.courseId);
    course.enrolledCount = Math.max(0, course.enrolledCount - 1);
    await course.save();

    res.json({ message: 'Course dropped successfully', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId }).populate('student', 'name email');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
