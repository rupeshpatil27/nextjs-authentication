import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: {
      type: String,
      required: true,
    },
    emailVerified: { type: Date, default: null },
    isTwoFactorEnabled: { type: Boolean, default: false },
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
