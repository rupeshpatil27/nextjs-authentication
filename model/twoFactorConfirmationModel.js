import mongoose from "mongoose";

const TwoFactorConfirmationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

TwoFactorConfirmationSchema.index({ userId: 1 }, { unique: true });

const TwoFactorConfirmationModel =
  mongoose.models.TwoFactorConfirmation ||
  mongoose.model("TwoFactorConfirmation", TwoFactorConfirmationSchema);

export default TwoFactorConfirmationModel;
