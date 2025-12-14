import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <h1 className="logo">AuthProject</h1>

                <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>

                    {!isAuthenticated && (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}

                    {isAuthenticated && (
                        <>
                            <li><Link to="/profile">Profile</Link></li>

                            {user?.roles?.includes("admin") && (
                                <li><Link to="/admin">Admin</Link></li>
                            )}

                            
                        </>
                    )}
                </ul>

                <div className="icon" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
