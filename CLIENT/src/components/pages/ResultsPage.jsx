import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";


export default function ResultsPage(){

    const navigate = useNavigate();
    const [rollno, setrollno] = useState('');

    const handleChange1 = (e) =>{
        const {value} = e.target;
        setrollno(value);
    }


    const handleGetResult = (e) =>{
        e.preventDefault();
        console.log('Submitting', { rollno });

        setrollno('');
        navigate("/GetResult");
    }



    return (
        <div>
            <header className="header">
                <div className="nav-container">
                <h1 className="nav__logo">STUDENT RESULTS MANAGEMENT PORTAL</h1> 
                
                <div className="login">
                    <NavLink to="/Login" className="login-button">LOGIN</NavLink>
                </div>
                
                </div>
                
            </header>
            <h1 className="title">Results Page</h1>
            <h3 style={{fontFamily: "sans-serif", display: "grid", paddingBottom: "20px"}} htmlFor="rollno">ENTER YOUR ROLL NUMBER BELOW TO VIEW YOUR RESULT</h3>

            <form className="login-form">
                
                <input placeholder="ROLL NO." className="login-fields" type="text" id="rollno" onChange={handleChange1} autoComplete="off" required/>

                <button className="LOgin-button" type="submit" onClick={handleGetResult} >GET RESULT</button>
            </form>
        </div>
    )
    
}