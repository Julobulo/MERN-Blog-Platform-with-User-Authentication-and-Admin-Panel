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
    required: [true, "Your password is required"],
  },
  bio: { type: String },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  profilePicture: {
    type: String, default: `
    /9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDW5odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMS44OCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFN0b2NrIFBsYXRmb3JtPC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcE1NPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vJz4KICA8eG1wTU06RG9jdW1lbnRJRD54bXAuaWlkOjVkYzhhZmYwLTdhMGUtNDlmZS05ZmE1LWFmMmI4MWQzMWEyYjwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD5hZG9iZTpkb2NpZDpzdG9jazo0ZTkyMmRjNC03OGQ2LTQyMzItODkzMC0yNGI3YzUxMWJkOTU8L3htcE1NOkluc3RhbmNlSUQ+CiAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpzdG9jazo1NTM3OTYwOTA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAF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
    `
  },
  articlesLiked: {
    type: [
      {
        type: String, // article's _id
      },
    ],
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
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
