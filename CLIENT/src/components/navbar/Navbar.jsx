import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // List of paths where the Navbar should not be displayed
    const hideNavbarPaths = ["/ResultsPage", "/Login", "/GetResult"];
    const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));

    if (shouldHideNavbar) {
        return null;
    }

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="logo_adjust">
                    <NavLink to="/" className="nav__logo">
                        STUDENT RESULTS MANAGEMENT PORTAL
                    </NavLink>
                </div>

                <button className="nav__menu-button" onClick={toggleMenu}>
                    ☰
                </button>

                {/* Updated className handling */}
                <div className={`nav__menu ${menuOpen ? "show" : ""}`} onMouseLeave={closeMenu}>
                    <ul className="nav__list">
                        <li className="nav__item">
                            <NavLink to="/" className="nav__link" onClick={closeMenu}>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/ManageStudents" className="nav__link" onClick={closeMenu}>
                                Class Details
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/ManageResults" className="nav__link" onClick={closeMenu}>
                                Manage Results
                            </NavLink>
                        </li>
                        <li className="nav__item">
                            <NavLink to="/ResultsPage" className="nav__link" onClick={closeMenu}>
                                Logout
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
