import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function AddStudent(){

  const [rollno, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [classno, setClassNo] = useState('');
  const [email, setEmail] = useState('');

  // Function to handle changes in input fields of the form...
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'rollno':
        setRollNo(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'classno':
        setClassNo(value);
        break;
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({ classno, rollno, name, email });

    axios.post("http://localhost:8801/insertstudent", { classno, rollno, name, email }).then((response) => {
      alert("Student added/edited successfully!");
    });

    }

    //INSERT INTO studentsList (classno, rollNo, name, email) VALUES ( 1, 1, 'John Doe', 'john@example.com');



  const navigate = useNavigate();
  const handleGoBack = (path) => {
    navigate(path);
  }

    return (
        <div>
        <h1 className="title1">Add Student Details </h1>
        <button className="back-button" onClick={() => handleGoBack("/ManageStudents")}>Go Back</button>
        <form onSubmit={handleSubmit}>

            <ul className="std-list">
              
              <li className="det-list">
                <p>ClassNo. : </p>
                <input type="number" name="classno" value={classno} onChange={handleChange} autoComplete="off"></input> 
              </li>

              <li className="det-list">
                <p> Roll number : </p>
                <input type="number" name="rollno" value={rollno} onChange={handleChange} autoComplete="off"></input>
              </li>
              
              <li className="det-list">
              <p> Name : </p>
                <input type="text" name="name" value={name} onChange={handleChange} autoComplete="off"></input>
              
              </li>

              <li className="det-list">
              <p> Email address : </p>
              <input label="Email Address" type="text" name="email" value={email} onChange={handleChange} autoComplete="off"></input>
              
              </li>

    
            </ul>
          <div className="std-sub">
            <button className="std-sub-button" type="submit" onClick={()=>{handleSubmit}}>Submit</button>
          </div>
        </form>



        </div>
    )
}