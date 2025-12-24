import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
});

VerificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationModel =
  mongoose.models.VerificationToken ||
  mongoose.model("VerificationToken", VerificationTokenSchema);

export default VerificationModel;
