import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";



export default function Login(){

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const navigate = useNavigate();

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    console.log('Submitting', { username, password });

    setUsername('');
    setPassword('');

    navigate("/");
  } 

  



    return(
        <div>
            <header className="header">
                <div className="nav-container">
                <h1 className="nav__logo">STUDENT RESULTS MANAGEMENT PORTAL</h1> 
                
                </div>
            </header>
            
                <div className="left-half">

                    <h1 className="title1">Admin Login</h1>
                    
                    <form className="login-form" onSubmit={handleSubmitLogin}>
                                <label htmlFor="username">Username:</label>
                                <input className="medium-input" type="text" id="username" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)}required/>

                                <label htmlFor="password">Password:</label>
                                <input className="medium-input" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}required/>
                        <div className="Box-Container">
                        <button className="add-std-btn" type="submit" >Login</button>
                        </div>
                      </form>
                </div>  
            
          </div>
    );
}