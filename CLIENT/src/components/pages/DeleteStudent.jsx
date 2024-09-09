import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function DeleteStudent() {

    const navigate = useNavigate();
    const handleGoBack = (path) => {
      navigate(path);
    }


    const [years, setYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8801/getYears')
            .then(response => setYears(response.data))
            .catch(error => console.error('Error fetching years:', error));
    }, []);

    useEffect(() => {
        if (selectedYear) {
            axios.get(`http://localhost:8801/getClassNo/${selectedYear}`)
                .then(response => setClasses(response.data))
                .catch(error => console.error('Error fetching classes:', error));
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedYear && selectedClass) {
            axios.get(`http://localhost:8801/getStudents/${selectedClass}/${selectedYear}`)
                .then(response => {
                    setStudents(response.data);
                    toast.warning("Carefully enter the student ID to delete. Delete cannot be undone.");
                })
                .catch(error => console.error('Error fetching students:', error));
        }
    }, [selectedYear, selectedClass]);

    const handleDeleteStudent = () => {
        const idPattern = /^[1-9]\d*$/; // Regex for positive integers
        if (!idPattern.test(studentId)) {
            toast.error('Please enter a valid positive number for student ID.');
            return;
        }

        axios.delete('http://localhost:8801/deleteStudent', { data: { id: studentId } })
            .then(response => {
                toast.success('Student deleted successfully');
                setStudentId(''); // clear the input field
                setStudents(students.filter(student => student.ID !== parseInt(studentId)));
            })
            .catch(error => {
                console.error('Error deleting student:', error);
                toast.error('Failed to delete student');
            });
    };

    return (
        <div>
            <h1 className="title1">Delete a Student</h1>
        <div className="delete-student-container">
            <div className='box' style={{height: "50vh"}}>
                <div className="left-half">
                    <h2>Delete Student with their ID</h2>
                    <div>
                        <label>Student ID:</label>
                        <input 
                            type="text" 
                            value={studentId} 
                            onChange={(e) => setStudentId(e.target.value)}
                            className="medium-input"
                            placeholder="Enter student ID" 
                        />
                    </div>
                    <button className='std-sub-button' style={{marginTop: "0px"}} onClick={handleDeleteStudent}>Delete Student</button>
                </div>
            </div>

            <div className='box'> 
                <div className="right-half">
                    <p style={{paddingBottom: "10px"}}>View from classes below and check their details</p>
                    <div style={{display: "flex"}}>
                        
                        <div className="dropdown-container">
                            <label>Year</label>
                            <select className="dropdown" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value="">Select Year</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year.year_name}>{year.year_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="dropdown-container">
                            <label>Class</label>
                            <select className="dropdown" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                <option value="">Select Class</option>
                                {classes.map((classNo, index) => (
                                    <option key={index} value={classNo.classNo}>{classNo.classNo}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {students.length > 0 && (
                        <div className="scrollable-table-container">
                            <h3 className='title1'>List of Students</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.ID}</td>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>

            <ToastContainer />
        </div>
    )
}
