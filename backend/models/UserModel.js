import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: [true, "Your bio is required"],
    default: ' ',
  },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  profilePicture: {
    type: String,
    default: `/default.png`,
  },
  articlesLiked: {
    type: [
      {
        type: String, // article's _id
      },
    ],
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt is required"],
    default: Date.now,
  },
}, { timestamps: true });


// Add pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    this.username = this.username.trim();
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
