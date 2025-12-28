# Next.js Authentication System

A robust authentication system built with **Next.js** and **Auth.js v5**. This project utilizes the Credentials Provider for secure sign-in, while custom server actions handle the full user lifecycle, including registration and account recovery.

## 🚀 Features

- **Session Management:** Handled efficiently via [Auth.js v5](authjs.dev).
- **Secure Sign-In:** Utilizes the [Auth.js Credentials Provider](https://authjs.dev/getting-started/authentication/credentials) for email/password sign-in.
- **Full User Lifecycle Management:**
  - **User Registration:**  Secure signup with password hashing.
  - **Email Verification:** Token-based verification flow.
  - **Password Reset:** Secure "Forgot Password" process with time-sensitive tokens.
  - **Two-Factor Authentication (2FA):** Integrated authentication logic.
- **Validation:** Type-safe schema validation using **Zod**.
- **Email Service:** Integration with **Resend** for transactional delivery.
- **Database:** Scalable data management with **MongoDB** and **Mongoose**.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Auth:** [Auth.js v5](authjs.dev)
- **Validation:** Zod
- **Database:** MongoDB (via Mongoose)
- **Email:** Resend
- **Styling:** Tailwind CSS + React Email
