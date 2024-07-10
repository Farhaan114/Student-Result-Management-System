import React from "react";
import {useHistory} from "react-dom";
import "../navbar/AdminHome.css";

const date = new Date();


export default function AdminHome(){
    return(
        <div>
            
            <div className="title">
            <h1>Admin Home</h1>
            </div>

            <div className="buttonbox">
            
            <a href="/ManageStudents" className="button">Manage Students</a>

            <a href="/ManageResults" className="button">Manage Results</a>

            </div>        
        </div>
    )
}