import React from 'react';
import { AiOutlineUserAdd, AiOutlineLogin, AiOutlineLock, AiOutlineSync } from 'react-icons/ai';
import { BiServer } from 'react-icons/bi';
import './About.css';

const About = () => {
    return (
        <section className="about">
            <div className="container">
                <h2>About This Project</h2>
                <p>
                    This project is a <strong>Full-Stack JWT Authentication System</strong> built with <strong>React.js</strong> on the frontend and <strong>Node.js/Express</strong> with <strong>MongoDB</strong> on the backend.
                    It implements a secure authentication system using <strong>Access Tokens</strong> and <strong>Refresh Tokens</strong>, along with <strong>role-based access control</strong>.
                </p>

                <h3>Key Features</h3>
                <ul className="features-list">
                    <li><AiOutlineUserAdd className="feature-icon" /> User Registration and Login</li>
                    <li><AiOutlineLock className="feature-icon" /> Secure password hashing with <strong>bcrypt</strong></li>
                    <li><AiOutlineLogin className="feature-icon" /> JWT-based authentication (Access & Refresh tokens)</li>
                    <li><AiOutlineSync className="feature-icon" /> Silent token refresh on app load</li>
                    <li><BiServer className="feature-icon" /> Client-side logout and server-side logout</li>
                    <li><AiOutlineLock className="feature-icon" /> Protected routes and role-based access</li>
                    <li><AiOutlineUserAdd className="feature-icon" /> Fully responsive frontend with React</li>
                </ul>

                <h3>Installation</h3>
                <ol className="installation">
                    <li>Clone the repository: <code>git clone https://github.com/yourusername/your-repo.git</code></li>
                    <li>Navigate to backend folder: <code>cd backend</code></li>
                    <li>Install dependencies: <code>npm install</code></li>
                    <li>Create a <code>.env</code> file with MongoDB URI, JWT secrets, and other configs</li>
                    <li>Start backend server: <code>npm run dev</code></li>
                    <li>Navigate to frontend folder: <code>cd frontend</code></li>
                    <li>Install dependencies: <code>npm install</code></li>
                    <li>Start frontend server: <code>npm run dev</code></li>
                </ol>

                <h3>Dependencies</h3>
                <p>
                    <strong>Frontend:</strong> React.js, React Router, Axios <br />
                    <strong>Backend:</strong> Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, cookie-parser, cors, dotenv
                </p>

                <h3>Folder Structure</h3>
                <pre>
{`backend/
├─ controllers/
│  └─ auth.controller.js
├─ models/
│  ├─ User.js
│  └─ RefreshToken.js
├─ routes/
│  ├─ auth.routes.js
│  └─ protected.routes.js
├─ utils/
│  └─ tokens.js
├─ server.js
├─ package.json
frontend/
├─ src/
│  ├─ api/
│  │  └─ apiFetch.js             # Axios or fetch wrapper for API calls
│  ├─ components/
│  │  ├─ hero/
│  │  │  ├─ Hero.jsx             # Hero section of landing page
│  │  │  ├─ About.jsx            # About section
│  │  │  └─ Navbar.jsx           # Navbar for navigation
│  │  └─ PrivateRoute.jsx        # Protect routes based on auth
│  ├─ context/
│  │  └─ AuthContext.jsx         # Authentication context provider
│  ├─ pages/
│  │  ├─ Login.jsx               # Login page
│  │  ├─ Register.jsx            # Register page
│  │  └─ Profile.jsx             # Protected profile page
│  ├─ App.jsx                     # Main app with routing
│  └─ main.jsx                    # React DOM render entry
├─ package.json
└─ index.css                      # Global styles (or About.css / Hero.css etc.)
`}
                </pre>

                <h3>Functionality</h3>
                <p>
                    1. Users can <strong>register</strong> and <strong>login</strong> using email and password.<br />
                    2. Backend issues an <strong>Access Token</strong> and <strong>Refresh Token</strong>. Access tokens are short-lived, while refresh tokens are stored in <strong>HTTP-only cookies</strong>.<br />
                    3. On page load, the app attempts a <strong>silent refresh</strong> to keep the user logged in without asking credentials again.<br />
                    4. Protected routes require a valid access token; role-based access controls restrict specific actions.<br />
                    5. Users can securely logout, which removes the access token client-side and revokes the refresh token server-side.
                </p>

                <h3>Why This Project?</h3>
                <p>
                    This project is perfect for anyone wanting to understand a real-world JWT authentication system with token rotation, refresh, and protected routes. It can be used as a boilerplate for secure full-stack applications.
                </p>
            </div>
        </section>
    );
};

export default About;
