import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true // Ensure course codes are unique
  },
  courseName: {
    type: String,
    required: true
  },
  section: String,
  semester: String,
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ]
});

module.exports = mongoose.model('Course', CourseSchema);
