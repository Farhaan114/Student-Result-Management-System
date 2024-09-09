import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManageResults() {
    const navigate = useNavigate();
    const handleClick2 = () => {
        navigate("/AddExam");
    };
    const handleClick3 = () => {
        navigate("/DeleteExam");
    };

    const [listOfExams, setListOfExams] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8801/showexams")
            .then((response) => {
                setListOfExams(response.data);
            })
            .catch(error => {
                console.error("Error fetching exams:", error);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter exams based on the search query
    const filteredExams = listOfExams.filter(exam =>
        exam.exam_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.course_code.toLowerCase().includes(searchQuery.toLowerCase())


    );

    return (
        <div>
            <h1 className="title1">Manage Results</h1>
            

            <div className= "Box-Container" style={{display: "flex", justifyContent: "center"}}>       
                <div className="caution-message">
                    <p>
                    The exams are listed below, click on them to view and edit students' marks.
                    </p>
                </div>
            </div>
            <div className="Box-Container">
                <button className="add-exam-btn" onClick={handleClick2}>Add New Exam Result</button>
                <button className="back-button" style={{marginTop: "12px", marginLeft: "0px"}} onClick={handleClick3}>Delete an Exam</button>

            </div>


            <div style={{ margin: "20px 0", textAlign: "center" }}>
                <input
                    type="text"
                    placeholder="Search exams...🔎 "
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ padding: "8px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
            </div>
        <div className="box" style={{fontWeight: "initial" }}>
            <div className="listofexams">
                {filteredExams.length > 0 ? (
                    filteredExams.map((exam, index) => (
                        <div className="exams" key={index}>
                            <div className="flip-box">
                                <div className="flip-box-inner">
                                    <div className="flip-box-front">
                                        <p>{exam.course_code}</p>
                                    </div>
                                    <div className="flip-box-back" onClick={() => { navigate(`/ViewExam/${exam.course_code}`) }}>
                                        <p>{exam.exam_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No exams found</p>
                )}
            </div>
            </div>
        </div>
    );
}
