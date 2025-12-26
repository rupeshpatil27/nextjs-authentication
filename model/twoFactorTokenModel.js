import mongoose from "mongoose";

const TwoFactorTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true },
});

TwoFactorTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const TwoFactorTokenModel =
  mongoose.models.TwoFactorToken ||
  mongoose.model("TwoFactorToken", TwoFactorTokenSchema);

export default TwoFactorTokenModel;

// TODO : check for cascade delete
