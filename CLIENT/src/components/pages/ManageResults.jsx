import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageResults(){

    const navigate = useNavigate();
    const handleClick2 = () =>{
        navigate("/AddExam");
    }

    const [listOfExams, setListofExams] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8801/resultdeets").then((response) =>{
            setListofExams(response.data);
        });
    }, []);


    return(
        <div>
            <h1 className="title">Manage Results</h1>

            <div style={{display: "flex", justifyContent: "flex-end"}}>
            <button className="add-exam-btn" onClick={handleClick2}> ADD A NEW EXAM </button>
            </div>

            <div className="listofexams">
            {listOfExams.map((value, i) => {
                return <div className="exams">
                    <div className="flip-box" key={i}>
                        <div className="flip-box-inner">
                            <div className="flip-box-front">
                                <p>{value.Tables_in_srms}</p> 
                            </div>
                            <div className="flip-box-back" onClick={() => {navigate(`/ViewExam/${value.Tables_in_srms}`)}}>
                                <p>VIEW / EDIT RESULTS</p>
                            </div>
                        </div>
                    </div>
                </div>
            })};
            </div>
        </div>
    )
}