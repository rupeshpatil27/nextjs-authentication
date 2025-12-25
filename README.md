# Next.js Authentication System

A robust authentication system built with **Next.js** and **NextAuth.js v4**. This project utilizes the Credentials Provider for secure sign-in and custom API routes for handling user lifecycle events like registration and account recovery.

## 🚀 Features

- **Session Management:** Handled via [NextAuth.js v4](next-auth.js.org).
- **Secure Sign-In:** Credentials Provider (Email/Password) integration.
- **Custom Auth APIs:**
  - **User Registration:** Secure signup with password hashing.
  - **Email Verification:** Token-based verification flow.
  - **Password Reset:** Secure "Forgot Password" process with time-sensitive tokens.
- **Validation:** Type-safe schema validation using **Zod**.
- **Email Service:** Integration with **Resend** for transactional delivery.
- **Database:** Scalable data management with **MongoDB** and **Mongoose**.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Auth:** NextAuth.js v4
- **Validation:** Zod
- **Database:** MongoDB (via Mongoose)
- **Email:** Resend
- **Styling:** Tailwind CSS + React Email