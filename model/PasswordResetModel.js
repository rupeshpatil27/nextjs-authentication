import mongoose from "mongoose";

const PasswordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
});

PasswordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const PasswordResetModel =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetModel;
