import Student from '../model/Student';
import Course from '../model/Course';

// Create a new student
const createStudent = async (req, res) => {
  try {
    const data = req.body;
    console.log('Received student data:', { ...data, password: '[REDACTED]' }); // Debug log to check incoming data

    const newStudent = await Student.create(data);
    res.status(201).json({
        success: true,
        data: newStudent,
        message: "Student Added to database."
    });
  }
  catch (e) {
    errorHandler(res, e, "Failed to add student");
  };
};

// Create a new course
const createCourse = async (req, res) => {
    try {
        const data = req.body;
        const newCourse = await Course.create(data);
        res.status(201).json({
            success: true,
            data: newCourse,
            message: "Course created."
        });
    } catch (e) {
        errorHandler(res, e, "Failed to create course");
    }
};

// List all students
const listStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({
            success: true,
            data: students
        });
    } catch (e) {
        errorHandler(res, e, "Failed to retrieve student list");
    }
};

// List all students in a specific course
const listStudentsByCourse = async (req, res) => {
    try {
        const courseCode = req.params.courseCode;
        const course = await Course.findOne({ courseCode }).populate('students');

        if (!course) return res.status(404).json({
            success: false,
            error: `Course with code ${courseCode} not found`
        });

        res.status(200).json({
            success: true,
            data: course.students
        });
    } catch (e) {
        errorHandler(res, e, `Failed to retrieve students for course ${req.params.courseCode}`);
    }
}

// List all courses
const listCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (e) {
        errorHandler(res, e, "Failed to retrieve courses");
    }
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

export const adminController = {
    createCourse,
    createStudent,
    listCourses,
    listStudents,
    listStudentsByCourse
};