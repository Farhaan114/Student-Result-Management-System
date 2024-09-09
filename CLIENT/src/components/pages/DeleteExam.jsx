import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const DeleteExam = () => {
    const [courseCode, setCourseCode] = useState('');
    const [examName, setExamName] = useState('');
    const [listOfExams, setListOfExams] = useState([]);

    const fetchExams = () => {
        axios.get("http://localhost:8801/showexams")
            .then((response) => {
                setListOfExams(response.data);
            })
            .catch(error => {
                console.error("Error fetching exams:", error);
            });
    };

    useEffect(() => {
        fetchExams();
        toast.warning("When an exam is deleted it cannot be undone. Proceed with caution!");
    }, []);

    const handleDelete = () => {
        const courseCodeRegex = /^[a-zA-Z0-9]+$/;
        const examNameRegex = /^[a-zA-Z0-9\s]+$/;

        if (!courseCodeRegex.test(courseCode)) {
            toast.error("Course Code can only contain positive numbers and alphabets.");
            return;
        }

        if (!examNameRegex.test(examName)) {
            toast.error("Exam Name can only contain positive numbers, alphabets, and spaces.");
            return;
        }

        axios.delete(`http://localhost:8801/deleteExam/${courseCode}/${examName}`)
            .then(response => {
                toast.success("Exam deleted successfully.");
                console.log("Exam deleted:", response.data);
                fetchExams(); // Refresh the list of exams
            })
            .catch(error => {
                toast.error("Error deleting exam, check details and try again.");
                console.error("Error deleting exam:", error);
            });
    };

    const navigate = useNavigate();
    const handleGoBack = (path) => {
      navigate(path);
    }

    return (
        <div>
            <h1 className='title1'>Delete an Exam</h1>
            <div className= "Box-Container" style={{display: "flex", justifyContent: "center"}}>       
            <div className="caution-message">
                <p>
                   Delete the exam you wish to delete by entering its details below.
                </p>
            </div>
            </div>
            <button className="back-button" style={{marginTop: "0px"}} onClick={() => handleGoBack("/ManageResults")}>Go Back</button>            

            
          

  
            
            <div className="delete-exam-container">
                <div className='box'>
                <div className="left-half">
                    <h2>Delete Exam with its Details</h2>
                    <div>
                        <label>Course Code:</label>
                        <input 
                            type="text" 
                            value={courseCode} 
                            onChange={(e) => setCourseCode(e.target.value)}
                            className="medium-input"
                            placeholder="Enter course code" 
                        />
                    </div>
                    <div>
                        <label>Exam Name:</label>
                        <input 
                            type="text" 
                            value={examName} 
                            onChange={(e) => setExamName(e.target.value)}
                            className="medium-input"
                            placeholder="Enter exam name" 
                        />
                    </div>
                    <button className='std-sub-button' onClick={handleDelete}>Delete Exam</button>
                </div>
               </div>

               <div className='box'> 
                <div className="right-half">
                    <div className="scrollable-table-container">
                        <h3 className='title1'>List of Exams</h3>

                        <table>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Exam Name</th>
                                    <th>Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listOfExams.map((exam, index) => (
                                    <tr key={index}>
                                        <td>{exam.course_code}</td>
                                        <td>{exam.exam_name}</td>
                                        <td>{exam.year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
};

export default DeleteExam;
