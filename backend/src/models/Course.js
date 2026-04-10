const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true, default: 'General' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop' },
  schedule: { type: String, required: true, default: 'Self-paced' },
  syllabus: [{ type: String }],
  capacity: { type: Number, required: true, default: 50 },
  enrolledCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'draft'], default: 'active' },
  waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true });

module.exports = mongoose.model('course', CourseSchema);
