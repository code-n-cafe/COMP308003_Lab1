import Course from '../model/Course.js';
import Student from '../model/Student.js';
import Enrollment from "../model/Enrollment.js";

// Add a course
const addCourse = async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const studentId = req.user.sub;
        const course = await Course.findOne({ courseCode });
        const section = req.body.section;
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student not found"
            });
        }

        // If both data exist, add the student to the course's students array
        const result = await course.updateOne(
            { $addToSet: { students: studentId } }
        );

        // Create enrollment
        const enrollment = await Enrollment.findOneAndUpdate(
            { student: studentId, course: course._id },
            { $setOnInsert: { section: section ?? "001" } },
            { new: true, upsert: true, runValidators: true }
        
        );

        if (result.modifiedCount === 0) {
            return res.status(200).json({
                success: true,
                message: "Student already enrolled."
            });
        }
        res.status(200).json({
            success: true,
            message: "Course added.",
            data: enrollment
        });
    } catch (e) {
        errorHandler(res, e, "Failed to add course");
    }
};

// List all courses from a specific student
const listCourseByStudent = async (req, res) => {
    try {
        const studentNumber = req.user.studentNumber;
        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student not found"
            });
        }

        const courses = await Course.find({ students: student._id });
        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (e) {
        errorHandler(res, e, "Failed to retrieve courses for the student");
    }
};

// Update a course

const updateCourse = async (req, res) => {
  try {
    const courseCode = req.params.courseCode;
    const section = req.body;

    if (!section) {
      return res.status(400).json({ success: false, error: "section is required" });
    }

    // assuming your auth middleware sets req.user with { sub, role }
    const studentId = req.user?.sub;
    if (!studentId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const students = await Student.findById(studentId);
    if (!students) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    const course = await Course.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { student: students._id, course: course._id },
      { section },
      { new: true, upsert: false, runValidators: true }
    );

    if (!enrollment) {
      // student is not enrolled yet (or you require enrollment to exist first)
      return res.status(404).json({ success: false, error: "Enrollment not found for this course" });
    }

    return res.status(200).json({
      success: true,
      data: enrollment,
      message: "Enrollment updated."
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Failed to update enrollment" });
  }
};

// Drop a course as a student
const dropCourse = async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const course = await Course.findOne({ courseCode });
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }
        const studentNumber = req.user.studentNumber;
        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student not found"
            });
        }

        // If both data exist, remove the student from the course's students array
        const result = await course.updateOne({ $pull: { students: student._id } });
        await Enrollment.deleteOne({ student: student._id, course: course._id });

        if (result.modifiedCount === 0) {
            return res.status(200).json({
                success: true,
                message: "Student was not enrolled in the course."
            });
        }
        res.status(200).json({
            success: true,
            message: "Course dropped."
        });
    } catch (e) {
        errorHandler(res, e, "Failed to drop course");
    };
};

const errorHandler = (res, error, defaultMessage = "An unexpected error occurred") => {
    console.error(`Controller error: ${error.message}`); // Log the error for debugging

    // Handle different error types
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Failed to validate input data',
            details: error.errors
        });
    }

    // Mongoose duplicate key error (e.g., unique constraint violation)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            error: `Duplicate value for field: ${field}`
        });
    }

    return res.status(500).json({
        success: false,
        error: defaultMessage
    });
}

export const studentController = {
    addCourse,
    listCourseByStudent,
    updateCourse,
    dropCourse
};