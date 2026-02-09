require('dotenv').config();
const connectDB = require('./config/mongoose');
const Student = require('./models/Student');

// Keeping this test here for reference, but it can be removed after confirming that the Student model and DB connection work correctly

(async () => {
  await connectDB();

  const student = await Student.create({
    studentNumber: '300000000',
    password: 'p@ssw0rd',
    firstName: 'john',
    lastName: 'doe',
    address: '01 main st',
    city: 'new city',
    phoneNumber: '123-456-7890',
    email: 'johndoe@centennial.com',
    program: 'Software Engineering',
    favoriteTopic: 'emerging technology',
    strongestSkill: 'AI'
  });

  console.log('Created student:', student);
  process.exit(0);
})();
