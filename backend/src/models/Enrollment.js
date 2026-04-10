const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'dropped'],
    default: 'enrolled'
  }
}, { timestamps: true });

module.exports = mongoose.model('enrollment', EnrollmentSchema);
