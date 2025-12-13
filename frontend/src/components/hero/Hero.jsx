import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineUserAdd, AiOutlineLogin } from 'react-icons/ai';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <h1>
                Welcome to <span className="highlight">AuthProject</span>
            </h1>
            <p>
                AuthProject is a full-stack authentication system built with <strong>React, Node.js, Express, and MongoDB</strong>. 
                <br />
                <strong>Note:</strong> This project focuses primarily on <em>functionality</em>—secure login, registration, JWT authentication, refresh tokens, and role-based access control—rather than styling or design.
            </p>
            <div className="hero-buttons">
                <Link to="/register" className="btn register-btn">
                    <AiOutlineUserAdd className="btn-icon" /> Register
                </Link>
                <Link to="/login" className="btn login-btn">
                    <AiOutlineLogin className="btn-icon" /> Login
                </Link>
            </div>
        </section>
    );
};

export default Hero;
