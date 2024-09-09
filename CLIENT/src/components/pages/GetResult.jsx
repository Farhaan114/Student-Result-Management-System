import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

export default function GetResult() {
    const { ID } = useParams();

    const [studentDetails, setStudentDetails] = useState(null);
    const [studentMarks, setStudentMarks] = useState([]);
    const [examDetails, setExamDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch student details
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8801/getStudentDetails/${ID}`);
                if (response.data.length > 0) {
                    setStudentDetails(response.data[0]); // Assuming the API returns an array
                } else {
                    setStudentDetails(null); // Handle case where no data is returned
                }
            } catch (err) {
                console.error("Error fetching student details:", err);
                setError("An error occurred while fetching the student details.");
            }
        };

        // Function to fetch student marks
        const fetchStudentMarks = async () => {
            try {
                const response = await axios.get(`http://localhost:8801/getStudentMarks/${ID}`);
                setStudentMarks(response.data);

                // Fetch exam details for each course code
                const examDetailsPromises = response.data.map(async (mark) => {
                    const examResponse = await axios.get(`http://localhost:8801/showExamMarks/${mark.CourseCode}`);
                    return {
                        courseCode: mark.CourseCode,
                        examDetails: examResponse.data,
                    };
                });

                // Resolving all promises and updating examDetails state
                const resolvedExamDetails = await Promise.all(examDetailsPromises);
                const examDetailsMap = resolvedExamDetails.reduce((acc, current) => {
                    acc[current.courseCode] = current.examDetails;
                    return acc;
                }, {});
                setExamDetails(examDetailsMap);

            } catch (err) {
                console.error("Error fetching student marks:", err);
                setError("An error occurred while fetching the student marks.");
            } finally {
                setLoading(false); // Set loading to false after all requests are complete
            }
        };

        fetchStudentDetails();
        fetchStudentMarks();
    }, [ID]);

    return (
        <div>
            <header className="header">
                <div className="nav-container">
                    <h1 className="nav__logo">STUDENT RESULTS MANAGEMENT PORTAL</h1>
                    <div className="nav__list">
                        <NavLink to="/ResultsPage" className="nav__link">Back</NavLink>
                    </div>
                </div>
            </header>

            <h1 className="title1">Your Results</h1>
            
            

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : studentDetails ? (
                <>
                <div className="box">
                    <div className="std-details-box">
                        <h4 className="std-details">ID: {ID}</h4>
                        <h4 className="std-details">Name: {studentDetails.Name}</h4>
                        <h4 className="std-details">Year: {studentDetails.Year}</h4>
                        <h4 className="std-details">Email: {studentDetails.Email}</h4>
                        <h4 className="std-details">ClassNo: {studentDetails.classNo}</h4>
                    </div>
                </div>
                    <div className="Box-Container">
                    <div className="caution-message">
                        <p>Note: Marks will appear as '-1' if absent.</p>
                    </div>
                    </div>

                <div className="table-container" style={{display: "flex", justifyContent: "center"}}>
                <div className="scrollable-table">
                    <table border="1" >
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Exam Name</th>
                                <th>Marks</th>
                                <th>Verdict</th>
                            </tr>
                        </thead>
                        <tbody>
                        {studentMarks.length > 0 ? (
                                studentMarks.map((mark, index) => {
                                    const exam = examDetails[mark.CourseCode];
                                    const verdict = mark.Marks === -1 ? "Absent" : (exam && mark.Marks >= exam.min_marks ? "Pass" : "Fail");
                                    return (
                                        <tr key={index}>
                                            <td>{mark.CourseCode}</td>
                                            <td>{mark.ExamName}</td>
                                            <td>{mark.Marks}</td>
                                            <td>{verdict}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">No marks available for this student.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                    </div>
                </>
            ) : (
                <p>No data available for this student ID.</p>
            )}
        </div>
    );
}
