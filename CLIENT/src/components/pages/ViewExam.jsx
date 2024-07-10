import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";  

const maxmarks = 100;
const minmarks = 35;

export default function ViewExam(){
    
    let { examname } = useParams()

    const [examData, setExamData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8801/examdeets/${examname}`).then((response) =>{
            setExamData(response.data);
        })
    }, []);

    const [inputValue, setInputValue] = useState('');

    const handleEditMarks = (event) =>{
        setInputValue(event.target.value);
    };

    const handleSave = async (rollno, examname, mark) => {
        try{
            await axios.post("http://localhost:8801/marksave", {rollno, examname, mark});
            console.log("item edited.");
        }
        catch (error) {
            throw error;
        } 

        // setInputValue(''); //clears the state
    }

    return (
        <div>
            <h1 className="title1">{examname}</h1>
            
            <div style={{display: "flex", gap: "90px"}}>
            <p className="title1" style={{fontWeight: "600"}}>Maximum marks : {maxmarks}</p>
            <p className="title1" style={{fontWeight: "600"}}>Minimum marks : {minmarks}</p>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                        <th>RollNo.</th>
                        <th>Name</th>
                        <th>Marks Obtained</th>
                        <th>Edit Marks (if needed)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            examData.map((d,i) => {

                                const {rollno, name, marks} = d;

                                return(
                                    <tr key={i}>
                                        <td>{rollno}</td>
                                        <td>{name}</td>
                                        <td>{marks}</td>
                                        <td>
                                            <form>
                                                <input type="number" value={inputValue} onChange={handleEditMarks} placeholder={marks} />
                                                <button type="button" onClick={() => {handleSave(rollno, examname, inputValue); window.location.reload(false);}} 
                                                style={{backgroundColor: "rgb(182, 39, 39)", color: "white", fontFamily: "Montserrat", borderRadius: "5px", width: "80px"}}>
                                                    SAVE</button>
                                            </form>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div> 
        </div>
    )
}