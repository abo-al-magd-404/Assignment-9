# Assignment 9 – Saraha Application

**Student:** abo al magd  
**Group:** Node_C45_Mon&Thurs_8:30pm_(Online)  

---

## Project Overview

Saraha is a social media web application focused on anonymous messaging. It lets users receive hidden messages from others—optionally allowing replies if both parties have accounts. The platform is built for scalability and security, with features that include account management, secured messaging, and Google OAuth integration.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup & Run](#setup--run)
- [Architecture Insights](#architecture-insights)

---

## Features

- **User Management:**  
  - Signup (with Email OTP) and Login (system or Google)
  - Secure password hashing and credential updates
  - Profile management, soft-delete, and password update/recovery
- **Messaging:**  
  - Send/Receive anonymous messages (support text, images, emojis, attachments)
  - Inbox management with soft-delete
- **Security:**  
  - Hashing (argon2, bcrypt), encryption, JWT authentication, input validation
  - Email verification for signup; OTP-based account activation
- **Other:**  
  - File upload support
  - Modular code for easy enhancements
  - Deployment-ready (tested with AWS EC2)

---

## Technology Stack

- **Node.js / Express** (`"express": "^5.2.1"`)
- **MongoDB & Mongoose**
- **JWT, bcrypt, argon2** (Authentication/Security)
- **Google OAuth** (`"google-auth-library"`)
- **Email via Nodemailer (or compatible provider)**
- **dotenv, cors, cross-env** (Environment and DevOps)

For other dependencies, see [`package.json`](https://github.com/abo-al-magd-404/Assignment-9/blob/main/package.json).

---

## Project Structure

```
src/
├── DB/
│   ├── connection.db.js          # MongoDB connection logic
│   ├── database.repository.js    # Data repositories (CRUD abstractions)
│   └── models/
│       └── user.model.js         # User schema/model
├── common/
│   ├── enums/                    # Enums for user roles, security, etc.
│   └── utils/
│       ├── response/             # API response formatting & error handling
│       └── security/             # Security-related helpers
├── middleware/
│   ├── authentication.middleware.js # JWT/token validation
│   └── index.js
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js    # Signup/login logic, OTP, Google OAuth
│   │   └── auth.service.js
│   └── user/
│       ├── user.controller.js    # User profile, update, soft-delete
│       ├── user.service.js
│       └── user.authorizations.js
├── app.bootstrap.js              # Express app, routers, global error handler
├── main.js                       # App entry (runs bootstrap)
config/
  config.service.js               # (not shown, handles env config & port)
```

---

## Setup & Run

1. **Clone and install dependencies**
    ```bash
    git clone https://github.com/abo-al-magd-404/Assignment-9.git
    cd Assignment-9
    npm install
    ```

2. **Create `.env` file in the root directory:**
    ```
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
    (add other necessary environment variables)
    ```

3. **Development Server**
    ```bash
    npm run start:dev
    ```

4. **Production**
    ```bash
    npm run start:prod
    ```

---

## Architecture Insights

- **Express App Setup:**  
  Central app initialization is in [`app.bootstrap.js`](https://github.com/abo-al-magd-404/Assignment-9/blob/main/src/app.bootstrap.js):  
  - Sets up Express, CORS, body parsing
  - Connects to MongoDB
  - Integrates authentication/user routers
  - Configures centralized error handling and 404 routing

- **Modules:**  
  - **/modules/auth**: Handles authentication logic (including Google OAuth, email OTP, signup, login)
  - **/modules/user**: Handles user profile, update, and permissions

- **Database Layer:**  
  - Mongoose models under `/DB/models`
  - Repository pattern via `/DB/database.repository.js`

- **Security:**  
  - Passwords and OTP hashed using argon2/bcrypt
  - JWT tokens for authentication
  - Email verification via OTP (see process details inside `SarahaApp.txt`)

- **Non-Functional**  
  - Code organization ready for scaling and performance tuning, with separation of concerns for business logic, middleware, and utilities.
  - Continuous deployment ready (Docker/AWS EC2 tested)

---

## Value Proposition

Saraha enables secure, anonymous communication with industry-standard security practices for modern social applications. Built modular and scalable, it supports traditional credential login and OAuth, secure messaging, and is deployable in cloud environments.

---

> For business logic details, workflow diagrams, or in-depth functional breakdown, see [SarahaApp.txt](https://github.com/abo-al-magd-404/Assignment-9/blob/main/SarahaApp.txt)

