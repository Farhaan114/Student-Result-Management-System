import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css"; 

export default function AddExam(){

    const [exam_name, setExamname] = useState('');
    const [course_code, setCourseCode] = useState('');
    const [max_marks, setMaxmarks] = useState('');
    const [min_marks, setMinmarks] = useState('');
    const [year, setYear] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Updated regex for course code to match 2 letters followed by alphanumerics
    const courseCodeRegex = /^[A-Za-z]{2}[A-Za-z0-9]+$/;
    const examNameRegex = /^[a-zA-Z ]+$/;

    const handleChange = (event) => {
        const { name, value } = event.target;
        let isValid = true;

        switch (name) {
            case 'course_code':
                if (!courseCodeRegex.test(value)) {
                    isValid = false;
                    toast.error("Course Code should be 2 letters followed by alphanumerics (e.g., CS201 or CS201T).");
                }
                break;
            case 'exam_name':
                if (!examNameRegex.test(value)) {
                    isValid = false;
                    toast.error("Exam Name can only contain alphabets and spaces.");
                }
                break;
            case 'year': 
                if (!/^\d+$/.test(value) || parseInt(value) <= 0 || parseInt(value) > 5) {
                    isValid = false;
                    toast.error("Year should be a valid number between 1 and 5.");
                }
                break;
            case 'max_marks':
                if (!/^\d+$/.test(value) || parseInt(value) < 0) {
                    isValid = false;
                    toast.error("Maximum Marks should be a positive number.");
                }
                break;
            case 'min_marks':
                if (!/^\d+$/.test(value) || parseInt(value) < 0) {
                    isValid = false;
                    toast.error("Minimum Marks should be a positive number.");
                }
                break;
            default:
                break;
        }

        if (!isValid && submitted) {
            return;
        }

        // Update state
        switch (name) {
            case 'course_code':
                setCourseCode(value);
                break;
            case 'exam_name':
                setExamname(value);
                break;
            case 'year': 
                setYear(value);
                break;
            case 'max_marks':
                setMaxmarks(value);
                break;
            case 'min_marks':
                setMinmarks(value);
                break;
        }
    };
  
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);

        if(!course_code || !exam_name ||!year || !max_marks || !min_marks) {
            toast.error("Please fill in all fields!");
            return;
        }

        // Validate before sending
        if (!courseCodeRegex.test(course_code)) {
            toast.error("Course Code is invalid.");
            return;
        }
        if (!examNameRegex.test(exam_name)) {
            toast.error("Exam Name is invalid.");
            return;
        }

        axios.post("http://localhost:8801/insertExam", {course_code, exam_name, year, max_marks, min_marks})
        .then((response) => {
            if(response.status === 200){
                toast.success("Exam added successfully!");
                console.log(response.status);
            }
        })
        .catch((error) => {
            if(error.response && error.response.status === 409){
                toast.error("Exam already exists.");
                console.log(error.response.status);
            } else if(error.response && error.response.status === 400) {
                toast.error("Error in the details, check details and try again.");
                console.log(error);
            } else {
              toast.error("Database Error!");
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

    return(
        <div>
            <h1 className="title1">Add a new Exam </h1>
            <div className="Box-Container">
                <div className="caution-message" style={{flexDirection: "column", alignItems:"flex-start", height: "20vh"}}>
                    <p>To enter a new exam successfully:</p>
                    <p>____________________________________________________________________________</p>
                    <p> 1. Fill details and click 'Submit' </p>
                    <p> 2. Click on 'Update Tables' to ensure that the exam is added.</p>
                </div>
            </div>
            
            <button className="back-button" onClick={() => handleGoBack("/ManageResults")}>Go Back</button>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2 style={{display: "grid", fontFamily: "Montserrat"}}>Enter exam details below </h2>
                    <ul className="std-list">
                        <li className="det-list">
                            <p>Course Code : </p>
                            <input 
                                type="text" 
                                name="course_code" 
                                value={course_code} 
                                onChange={handleChange} 
                                autoComplete="off" 
                            />
                            {submitted && !course_code && <span style={{color: "red"}}>Course Code is required!</span>}
                        </li>

                        <li className="det-list">
                            <p> Exam Name : </p>
                            <input 
                                type="text" 
                                name="exam_name" 
                                value={exam_name} 
                                onChange={handleChange} 
                                autoComplete="off"
                            />
                            {submitted && !exam_name && <span style={{color: "red"}}>Exam Name is required!</span>}
                        </li>

                        <li className="det-list">
                            <p> Year : </p>
                            <input 
                                type="number" 
                                name="year" 
                                value={year} 
                                onChange={handleChange} 
                                autoComplete="off"
                            />
                            {submitted && !year && <span style={{color: "red"}}>Year is required!</span>}
                        </li>

                        <li className="det-list">
                            <p> Maximum Marks : </p>
                            <input 
                                type="number" 
                                name="max_marks" 
                                value={max_marks} 
                                onChange={handleChange} 
                                autoComplete="off"
                            />
                            {submitted && !max_marks && <span style={{color: "red"}}>Maximum Marks is required!</span>}
                        </li>

                        <li className="det-list">
                            <p> Minimum Marks : </p>
                            <input  
                                type="number" 
                                name="min_marks" 
                                value={min_marks} 
                                onChange={handleChange} 
                                autoComplete="off"
                            />
                            {submitted && !min_marks && <span style={{color: "red"}}>Minimum Marks is required!</span>}
                        </li>
                    </ul>
                    <div className="std-sub">
                        <button className="std-sub-button" type="submit">Submit</button>
                        <button className="std-sub-button" onClick={handleUpdate} style={{backgroundColor: "orangered"}}>Update Exams Table</button>
                    </div>
                </form>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={3000}
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
    )
};
