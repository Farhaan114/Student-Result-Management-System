import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";


export default function ResultsPage(){

    const navigate = useNavigate();
    const [ID, setID] = useState('');

    const handleChange1 = (e) =>{
        const { value } = e.target;

        // Ensure that only a 3-digit number is allowed
        if (/^\d{0,3}$/.test(value)) {
            setID(value);
        }
    }


    const handleGetResult = (e) =>{
        e.preventDefault();
        console.log('Submitting', { ID });

        // Check if ID is not entered or not a valid 3-digit number
        if (!ID) {
            toast.error("Please enter your ID to view results!");
        } else if (ID.length !== 3) {
            toast.error("ID must be a 3-digit number!");
        } else {
            navigate(`/GetResult/${ID}`);
        }
    }

    return (
        <div>
            <header className="header">
                <div className="nav-container">
                    <h1 className="nav__logo">STUDENT RESULTS MANAGEMENT PORTAL</h1> 
                    
                    <div className="nav__list">
                        <NavLink to="/Login" className="nav__link">LOGIN</NavLink>
                    </div>
                </div>
            </header>
            
            <h1 className="title1">Results Page</h1>
            
            <div className="Box-Container">
                <div className="caution-message" style={{flexDirection: "column", height: "40vh"}}>
                    <p>ENTER YOUR ID NUMBER BELOW TO VIEW YOUR RESULT</p>
                    
                    <form className="login-form">
                        <input 
                            placeholder="Enter your 3-digit ID" 
                            className="login-fields" 
                            type="text" 
                            id="ID" 
                            value={ID} 
                            onChange={handleChange1} 
                            autoComplete="off" 
                            required
                            pattern="\d{3}" 
                            maxLength="3"
                        />
                        
                        <div className="wrapper">
                            <button className="LOgin-button" type="submit" onClick={handleGetResult}>GET RESULT</button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={1900}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                    theme="light"
            />
        </div>
    );
}
