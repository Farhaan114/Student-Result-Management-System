import React, { useState } from "react"; 
import { NavLink, useLocation } from "react-router-dom"; 
import "./navbar.css";


const Navbar = () => {

    const location = useLocation();

    if(location.pathname === "/ResultsPage" || location.pathname === "/Login" || location.pathname === "/GetResult"){
        return null;
    }

    return(
        <header className="header">
            <nav className="nav-container">
                
            <div className="logo_adjust">
            <NavLink to="/ResultsPage" className="nav__logo">
                STUDENT RESULTS MANAGEMENT PORTAL
            </NavLink>
            </div>

            <div className="nav__menu" id="nav-menu">
                <ul className="nav__list">
                    <li className="nav__item">
                        <NavLink to="/AdminHome" className="nav__link">
                        Home
                        </NavLink>
                    </li>
                    <li className="nav__item">
                        <NavLink to="/ManageStudents" className="nav__link">
                        Manage Students
                        </NavLink>
                    </li>
                    <li className="nav__item">
                        <NavLink to="/ManageResults" className="nav__link">
                        Manage Results
                        </NavLink>
                    </li>
                    <li className="nav__item">
                        <NavLink to="/ResultsPage" className="nav__link">
                        Logout
                        </NavLink>
                    </li>

                </ul>
                
                
            </div>
            
            </nav>
        </header>
    )
}
export default Navbar