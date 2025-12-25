import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     match: [/.+\@.+\..+/, 'Please use a valid email address'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//   },
//   verifyCode: {
//     type: String,
//     required: [true, 'Verify Code is required'],
//   },
//   verifyCodeExpiry: {
//     type: Date,
//     required: [true, 'Verify Code Expiry is required'],
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
// });

// const UserModel = mongoose.models.Authuser || mongoose.model('Authuser', UserSchema);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: {
      type: String,
      required: true,
    },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // Restricts the field to these two values
      default: "USER",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
