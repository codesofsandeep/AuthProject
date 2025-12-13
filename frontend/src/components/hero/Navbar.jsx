import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons kept

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">
                    <h1>AuthProject</h1>
                </div>

                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/about" onClick={() => setMenuOpen(false)}>About Project</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)}>Try the Project</Link></li>
                </ul>

                <div className="icon" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
