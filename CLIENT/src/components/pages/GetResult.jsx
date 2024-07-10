import React from "react";  
import { NavLink } from "react-router-dom";

export default function GetResult(){
    return(
        <div>

            <header>
                <div className="nav-container">
                    <h1 className="nav__logo">STUDENT RESULTS MANAGEMENT PORTAL</h1> 
                    <div>
                        <NavLink to="/ResultsPage" className="nav__link" >Back</NavLink>
                    </div>
                </div>
                
            </header>

            <h1 className="title"> Your Results </h1>
            
        </div>
    )
};