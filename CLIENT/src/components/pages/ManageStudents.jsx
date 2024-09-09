import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReactModal from "react-modal";

ReactModal.setAppElement('#root');

export default function ManageStudents() {

    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [classes, setClasses] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectedClassNo, setSelectedClassNo] = useState('');

    // TO HANDLE CLICKS TO NAVIGATE TO OTHER PAGES
    const handleClick = (path) => {
        navigate(path);
    }

    // Fetch the years from the backend
    useEffect(() => {
        axios.get('http://localhost:8801/getYears')
            .then(response => {
                setYears(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log("An error occurred: ", error);
                toast.error("Failed to fetch years!");
            });
    }, []);

    useEffect(() => {
        if (selectedYear) {
            axios.get(`http://localhost:8801/getClassNo/${selectedYear}`)
                .then(response => {
                    setClasses(response.data);
                    console.log(response.data);
                })
                .catch(error => {
                    console.log("An error occurred: ", error);
                    toast.error("Failed to fetch classes!");
                });
        }
    }, [selectedYear]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    }

    const openModal = (classNo) => {
        setSelectedClassNo(classNo);
        axios.get(`http://localhost:8801/getStudents/${classNo}/${selectedYear}`)
            .then(response => {
                setStudentDetails(response.data);
                setModalIsOpen(true);
            })
            .catch(error => {
                console.log("An error occurred: ", error);
                toast.error("Failed to fetch student details!");
            });
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    return (
        <div>
            <div className="title1">
                <h1>View Student and Class Details</h1>
            </div>  
            <div className= "Box-Container" style={{display: "flex", justifyContent: "center"}}>       
            <div className="caution-message">
                <p>
                    To view the details of students, select a year and then click on the class.
                </p>
            </div>
            </div>
        
<div className="box">
            <div className="title1" style={{paddingTop: "40px"}}>
                <label htmlFor="yearSelect">Select Year  : </label>
                <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
                    <option value="" disabled>Select a year</option>
                    {years.map((year, index) => (
                        <option key={index} value={year.year_name}>{year.year_name}</option>
                    ))}
                </select>
            </div>

            <div className="class-tiles">
                {classes.map((classItem, index) => (
                    <div key={index} className="class-tile" onClick={() => openModal(classItem.classNo)}>
                        Class {classItem.classNo}
                    </div>
                ))}
            </div>
            
            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Student Details Modal"
                className={`modal ${modalIsOpen ? 'open' : ''}`}
                overlayClassName="overlay"
            >
                <div className="modal-content">
                    <h2>Class Details</h2>
                    <button onClick={closeModal} className="close-modal-btn">Close</button>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentDetails.map(student => (
                                <tr key={student.ID}>
                                    <td>{student.ID}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ReactModal>
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
