import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String },
  access_token: { type: String },
  expires_at: { type: Number },
  token_type: { type: String },
  scope: { type: String },
  id_token: { type: String },
  session_state: { type: String },
});

// Ensures a user can only have one account per specific provider
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const Account = mongoose.models.Account || mongoose.model('Account', AccountSchema);



// const SessionSchema = new mongoose.Schema({
//   sessionToken: { type: String, unique: true, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   expires: { type: Date, required: true },
// });

// export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);


// const VerificationTokenSchema = new mongoose.Schema({
//   identifier: { type: String, required: true },
//   token: { type: String, unique: true, required: true },
//   expires: { type: Date, required: true },
// });

// VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

// export const VerificationToken = mongoose.models.VerificationToken || 
//   mongoose.model('VerificationToken', VerificationTokenSchema);
