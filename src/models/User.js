import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  birthdate: { type: Date, required: true },
  url_profile: { type: String },
  address: { type: String },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function(password) {
        // Min 8 characters, 1 uppercase, 1 digit, 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;
        return passwordRegex.test(password);
      },
      message: 'Password must be at least 8 characters with 1 uppercase, 1 digit, and 1 special character (#$%&*@)'
    }
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  createdAt: { type: Date, default: Date.now }
});

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
