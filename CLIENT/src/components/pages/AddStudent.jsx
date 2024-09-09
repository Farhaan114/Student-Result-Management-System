import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/ReactToastify.css';



export default function AddStudent(){

  const sNotify = () => {
    toast.success("student added successfully!");
  };

  const eNotify = () => {
    toast.error("student added successfully!");
  };

  const [ID, setID] = useState('');
  const [classNo, setclassNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateMinMax = (maxValue, minValue) => {
    if (parseInt(maxValue) >= parseInt(minValue)) {
        return false;
    }
    return true;
};
  
  // Function to handle changes in input fields of the form...
  const handleChange = (event) => {
    const { name, value } = event.target;
    let isValid = true;

    switch (name) {
        case 'ID':
            if (!/^\d+$/.test(value)) {
                isValid = false;
            }
            break;
        case 'classNo':
            if (!/^\d+$/.test(value)) {
                isValid = false;
            }
            break;
        case 'year': 
            if (!/^\d+$/.test(value) || parseInt(value) <= 0 || parseInt(value) > 5) {
                isValid = false;
            }
            break;
        case 'name':
            if (!/^[a-zA-Z0-9 ]+$/.test(value) || parseInt(value) < 0) {
                isValid = false;
            }
            break;
        case 'email':
            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(value) || parseInt(value) < 0) {
              isValid = false;
            }
            break;
        

       
    }

    if (!isValid && submitted) {
        toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} is wrong, please check again!`);
    }

    switch (name) {
        case 'ID':
            setID(value);
            break;
        case 'classNo':
            setclassNo(value);
            break;
        case 'year': 
            setYear(value);
            break;
        case 'name':
            setName(value);
            break;
        case 'email':
            setEmail(value);
            break;
    }
};

const handleSubmit = (event) => {
  event.preventDefault();
  setSubmitted(true);

  if(!ID || !classNo ||!name || !year || !email) {
    toast.error("Please fill in all fields!");
    return;
  }


    console.log({ ID, classNo, name, email, year });

    axios.post("http://localhost:8801/AddStudent", { ID, classNo, name, email, year })
      .then((response) => {
        if(response.status == 201){
          toast.success("Student added successfully!");

          console.log(response.status);
        }
      })
      .catch((error) => {
        if(error.response && error.response.status == 422){
          toast.error("Student already exists.");
          console.log(error.response.status);
        }
        else{
          toast.error("An error occurred.");
          console.log(error);
        }
      });
 
    }

    const handleUpdate = (event) => {
      event.preventDefault();
  
      axios.post("http://localhost:8801/insertIntoMarks")
      .then((response) => {
        if(response.status === 200){
          toast.success("Exam table updated successfully!");
  
          console.log(response.status);
        }
      })
      .catch((error) => {
          toast.error("An error occurred while updating.");
          console.log(error);
      });
    }



  const navigate = useNavigate();
  const handleGoBack = (path) => {
    navigate(path);
  }

    return (
      <div>
      <h1 className="title1">Add a new Student </h1>
      <div className="Box-Container">
        <div className="caution-message" style={{flexDirection: "column", alignItems:"flex-start", height: "20vh"}}>
          <p>To enter a new student successfully:</p>
          <p>____________________________________________________________________________</p>
          <p> 1. Fill details and click 'Submit' </p>
          <p> 2. Click on 'Update Tables' to ensure that the student is added.</p>
        </div>
      </div>
    
      <button className="back-button" onClick={() => handleGoBack("/ManageStudents")}>Go Back</button>
      

    <div className="form-container">
    <form onSubmit={handleSubmit}>
    <h2 style={{display: "grid", fontFamily: "Montserrat"}}>Enter exam details below </h2>
        <ul className="std-list">
          
          <li className="det-list">
            <p>ID : </p>
            <input type="number" name="ID" value={ID} onChange={handleChange} autoComplete="off" />
            {submitted && !ID && <span style={{color: "red"}}>ID is required!</span>}
          </li>

          <li className="det-list">
            <p> Class No. : </p>
            <input type="number" name="classNo" value={classNo} onChange={handleChange} autoComplete="off"></input>
            {submitted && !classNo && <span style={{color: "red"}}>Class no. is required!</span>}
          </li>

          <li className="det-list">
          <p> Name : </p>
            <input type="text" name="name" value={name} onChange={handleChange} autoComplete="off"></input>
            {submitted && !name && <span style={{color: "red"}}>Name is required!</span>}
          </li>
          
          <li className="det-list">
          <p> Year : </p>
            <input type="number" name="year" value={year} onChange={handleChange} autoComplete="off"></input>
            {submitted && !year && <span style={{color: "red"}}>Year is required!</span>}
          </li>

          <li className="det-list">
          <p> Email id : </p>
          <input  type="text" name="email" value={email} onChange={handleChange} autoComplete="off"></input>
          {submitted && !email && <span style={{color: "red"}}>Email id is required!</span>}
          </li>


        </ul>
      <div className="std-sub">
        <button className="std-sub-button" type="submit">Submit</button>
        <button className="std-sub-button" onClick={handleUpdate} style={{backgroundColor: "orangered"}}>Update Tables</button>
      </div>
    </form>

    
    </div>
    <ToastContainer theme="dark"/>
    </div>
        
    )
}