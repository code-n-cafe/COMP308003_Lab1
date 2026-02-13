import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const StudentSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    // Do not select the password field by default when querying for students
    select: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  phoneNumber: String,
  email: {
    type: String,
    required: true,
    // Making sure email is unique, lowercase, trimmed, and in a valid format
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  program: String,
  favoriteTopic: String,
  strongestSkill: String
});

// fixed password hashing hook
StudentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// method to compare passwords
StudentSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ensure password is not returned in queries
StudentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

// Also ensure password is not returned when using toObject (e.g., for Mongoose's findOneAndUpdate with { new: true })
StudentSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model('Student', StudentSchema);
