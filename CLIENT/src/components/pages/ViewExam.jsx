import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ViewExam() {
    const notify = () => toast("Marks added Successfully!");

    const navigate = useNavigate();
    const goBack = () => {
        navigate("/ManageResults");
    }

    let { course_code } = useParams();

    const [examData, setExamData] = useState([]);
    const [examName, setExamName] = useState("");
    const [marksInfo, setMarksInfo] = useState({ max_marks: 0, min_marks: 0 });
    const [searchId, setSearchId] = useState("");
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8801/showOneExam/${course_code}`).then((response) =>{
            setExamData(response.data);
        })
        .catch(error => {
            console.error("Error fetching exams:", error);
        });
    }, [course_code]);

    useEffect(() =>{
        axios.get(`http://localhost:8801/showexamname/${course_code}`).then((response) => {
            setExamName(response.data);
        })
        .catch(error => {
            console.error("Error fetching the exam name:", error);
        });
    }, [course_code]);

    useEffect(() => {
        axios.get(`http://localhost:8801/showExamMarks/${course_code}`)
            .then((response) => {
                setMarksInfo(response.data);
            })
            .catch(error => {
                console.error("Error fetching marks information:", error);
            });
    }, [course_code]);

    const handleEditMarks = (event, ID) => {
        const newValue = event.target.value;

        if (newValue < -1) {
            toast.error("Marks cannot be negative!");
            return;
        }

        setInputValues(prevValues => ({
            ...prevValues, [ID]: newValue
        }));
    };

    const handleSave = async (ID, course_code, exam_name, marks) => {
        const maxMarks = marksInfo.max_marks;

        if (marks < -1) {
            toast.error("Marks cannot be negative!");
            return;
        }

        if (marks > maxMarks) {
            toast.error(`Marks cannot exceed ${maxMarks}`);
            return;
        }

        try {
            await axios.put("http://localhost:8801/updateStudentMarks", {
                studentId: ID,
                courseCode: course_code,
                examName: exam_name,
                marks: marks
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("Item edited.");
            toast.success("Mark updated!");
            // Optionally refetch data to ensure state consistency
            // await fetchExamData();
        } catch (error) {
            console.error("Error updating marks:", error);
            toast.error("Failed to update marks.");
        }
    };

    const filteredExamData = examData.filter((d) => {
        const idMatch = searchId === "" || d.ID.toString().includes(searchId);
        return idMatch;
    });

    // Calculate average, lowest, and highest marks
    const marksArray = filteredExamData.map(d => d.Marks).filter(mark => mark !== -1); // Filter out -1 if it signifies no marks

    const averageMarks = marksArray.length > 0 ? (marksArray.reduce((sum, mark) => sum + mark, 0) / marksArray.length).toFixed(2) : 0;
    const lowestMarks = marksArray.length > 0 ? Math.min(...marksArray) : 0;
    const highestMarks = marksArray.length > 0 ? Math.max(...marksArray) : 0;

    return (
        <div>
            <button className="back-button" onClick={goBack}>Back</button>
            <div className="box">
                <h1 className="title1">{course_code} : {examName}</h1>
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                    <p className="title1" style={{ fontWeight: "600" }}>Maximum marks : {marksInfo.max_marks}</p>
                    <p className="title1" style={{ fontWeight: "600" }}>Minimum marks : {marksInfo.min_marks}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                    <p className="title1" style={{ fontWeight: "600" }}>Average marks : {averageMarks}</p>
                    <p className="title1" style={{ fontWeight: "600" }}>Lowest mark : {lowestMarks}</p>
                    <p className="title1" style={{ fontWeight: "600" }}>Highest mark : {highestMarks}</p>
                </div>
            </div>

            <div className="box">
                <div style={{ margin: "20px 0px", textAlign: "right" }}>
                    <p style={{fontFamily: "Montserrat", paddingRight: "100px", fontWeight:"lighter"}}>Search Filter</p>
                    <input
                        type="text"
                        placeholder="Search by ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ padding: "5px 50px 5px 5px", width: "300px", marginRight: "100px" }} // Adjust width as needed
                    />
                </div>

                <div className="scrollable-table-container">
                    {filteredExamData.length === 0 ? (
                        <p>No records found</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Year</th>
                                    <th>Marks Obtained</th>
                                    <th>Edit Marks (Enter -1 if absent)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExamData.map((d, i) => {
                                    const { ID, Name, Year, Marks } = d;
                                    const currentMarks = inputValues[ID] !== undefined ? inputValues[ID] : Marks;

                                    return (
                                        <tr key={i}>
                                            <td>{ID}</td>
                                            <td>{Name}</td>
                                            <td>{Year}</td>
                                            <td>{currentMarks}</td>
                                            <td>
                                                <form onSubmit={(e) => e.preventDefault()}>
                                                    <input
                                                        type="number"
                                                        value={inputValues[ID] || ''}
                                                        onChange={(event) => handleEditMarks(event, ID)}
                                                        placeholder={Marks}
                                                        min="-1" // Ensure only valid input is allowed
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSave(ID, course_code, examName, inputValues[ID])}
                                                        style={{
                                                            backgroundColor: "rgb(182, 39, 39)",
                                                            color: "white",
                                                            fontFamily: "Montserrat",
                                                            borderRadius: "5px",
                                                            width: "80px"
                                                        }}
                                                    >
                                                        SAVE
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
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
    )
}
