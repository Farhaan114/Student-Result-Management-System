import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ShowStudentList } from "../../api-calls";
import axios from "axios";




export default function ManageStudents(){

    const navigate = useNavigate();

    // TO HANDLE CLICKS TO NAVIGATE TO OTHER PAGES
    const handleClick = (path) => {
        navigate(path);
    }

    const [data, setData] = useState([]);

    //TO DISPLAY ALL THE STUDENTS ON THE DB TABLE CALLED students.
    useEffect(() => {
        ShowStudentList().then((students)=>{
            setData(students);
        })
        .catch((error) => {
            console.log("an error occured ", error);
        });
    }, []);

    
    // BUTTON HANDLER TO REMOVE THE STUDENT FROM THE DB
    const removeStd = async (rollno) =>{
        try{
            await axios.post("http://localhost:8801/deletestudent", {rollno});
            console.log("item removed S.");
        }
        catch (error) {
            throw error;
        }
        
        handleClick("/ManageStudents");
        
    }


    return (
        <div>
            <div className="title1">
            <h1> Manage Students </h1>
            </div>

            <div className="add-std">
            <button className="add-std-btn" onClick={() => handleClick("/AddStudent")}>Add a new Student </button>
            </div>
                <table>
                    <thead>
                        <tr>
                        <th>ClassNo.</th>
                        <th>RollNo.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((d,i) =>{

                                const {classno, rollno, name, email} = d;

                                return(
                                <tr key={i}>
                                    <td><strong>{classno}</strong></td>
                                    <td>{rollno}</td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td><button style={{backgroundColor: "pink", color: "black", fontFamily: "Montserrat", borderRadius: "5px", width: "100px"}} onClick={() => {removeStd(rollno); window.location.reload(false);}} >Remove</button>/  
                                         <button style={{backgroundColor: "midnightblue", color:"white", fontFamily: "Montserrat", borderRadius: "5px", width: "50px"}} onClick={() => {handleClick("/AddStudent")}}>Edit</button>
                                    </td>
                                    
                                </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            <div> 
            </div>
        </div>
        
    
        )
}