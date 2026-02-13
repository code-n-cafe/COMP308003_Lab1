import Course from '../model/Course.js';
import Student from '../model/Student.js';

// Add a course
const addCourse = async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const studentNumber = req.user.studentNumber;
        const course = await Course.findOne({ courseCode });
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }
        const student = await Student.findOne({ studentNumber });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student not found"
            });
        }

        // If both data exist, add the student to the course's students array
        const result = await course.updateOne(
            { $addToSet: { students: student._id } }
        );

        
        if (result.modifiedCount === 0) {
            return res.status(200).json({
                success: true,
                message: "Student already enrolled."
            });
        }
        res.status(200).json({
            success: true,
            message: "Course added."
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

        const courses = await Course.find({ students: req.user.sub });
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
        const data = req.body;
        const updatedCourse = await Course.findOneAndUpdate({ courseCode }, data, { new: true });
        // In case the course code is not found, return a 404 error
        if (!updatedCourse) return res.status(404).json({ success:false, error:"Course not found" });
        res.status(200).json({
            success: true,
            data: updatedCourse,
            message: "Course updated."
        });
    } catch (e) {
        errorHandler(res, e, "Failed to update course");
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
        const result = await course.updateOne({ $pull: { students: req.user.sub } });
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