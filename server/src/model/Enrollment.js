import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    section: { type: String, required: true }, // or optional if assignment allows
  },
  { timestamps: true }
);

// prevents duplicates: a student can only enroll once per course
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", EnrollmentSchema);
