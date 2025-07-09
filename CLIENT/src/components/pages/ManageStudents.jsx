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
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [addForm, setAddForm] = useState({ ID: '', classNo: '', name: '', email: '', year: '' });
    const [addSubmitted, setAddSubmitted] = useState(false);

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

    // Add Student Modal handlers
    const openAddModal = () => {
        setAddForm({ ID: '', classNo: '', name: '', email: '', year: '' });
        setAddSubmitted(false);
        setAddModalIsOpen(true);
    };
    const closeAddModal = () => setAddModalIsOpen(false);

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateAddForm = () => {
        const { ID, classNo, name, email, year } = addForm;
        if (!ID || !classNo || !name || !email || !year) {
            toast.error("Please fill in all fields!");
            return false;
        }
        if (!/^[0-9]+$/.test(ID)) {
            toast.error("ID should be a number.");
            return false;
        }
        if (!/^[0-9]+$/.test(classNo)) {
            toast.error("Class No should be a number.");
            return false;
        }
        if (!/^[A-Za-z ]+$/.test(name)) {
            toast.error("Name can only contain alphabets and spaces.");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Invalid email address.");
            return false;
        }
        if (!/^[0-9]+$/.test(year) || parseInt(year) <= 0 || parseInt(year) > 5) {
            toast.error("Year should be a valid number between 1 and 5.");
            return false;
        }
        return true;
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setAddSubmitted(true);
        if (!validateAddForm()) return;
        axios.post('http://localhost:8801/AddStudent', addForm)
            .then((response) => {
                if (response.status === 201) {
                    toast.success("Student added successfully!");
                    closeAddModal();
                    // Optionally refresh student list if modal was open for a class
                    if (selectedClassNo && selectedYear) {
                        axios.get(`http://localhost:8801/getStudents/${selectedClassNo}/${selectedYear}`)
                            .then(response => setStudentDetails(response.data));
                    }
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    toast.error("Student already exists.");
                } else if (error.response && error.response.status === 400) {
                    toast.error("Error in the details, check details and try again.");
                } else {
                    toast.error("Database Error!");
                }
            });
    };

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
    <div>
    <button className="std-sub-button" style={{marginLeft: 20, height: 40, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom: 20}} onClick={openAddModal}>Add Student</button>

    </div>
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
            <ReactModal
                isOpen={addModalIsOpen}
                onRequestClose={closeAddModal}
                contentLabel="Add Student Modal"
                className={`modal ${addModalIsOpen ? 'open' : ''}`}
                overlayClassName="overlay"
            >
                <div className="modal-content">
                    <h2>Add a New Student</h2>
                    <button onClick={closeAddModal} className="close-modal-btn">Close</button>
                    <form onSubmit={handleAddSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: 20, alignItems: 'center'}}>
                        <div style={{display: 'flex', flexDirection: 'column', width: 320}}>
                            <label style={{marginBottom: 4, fontWeight: 500}}>ID</label>
                            <input type="text" name="ID" value={addForm.ID} onChange={handleAddFormChange} autoComplete="off" style={{width: '100%', padding: '8px', borderRadius: 5, border: '1px solid #ccc'}} />
                            {addSubmitted && !addForm.ID && <span style={{color: "red", fontSize: 12}}>ID is required!</span>}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: 320}}>
                            <label style={{marginBottom: 4, fontWeight: 500}}>Class No</label>
                            <input type="text" name="classNo" value={addForm.classNo} onChange={handleAddFormChange} autoComplete="off" style={{width: '100%', padding: '8px', borderRadius: 5, border: '1px solid #ccc'}} />
                            {addSubmitted && !addForm.classNo && <span style={{color: "red", fontSize: 12}}>Class No is required!</span>}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: 320}}>
                            <label style={{marginBottom: 4, fontWeight: 500}}>Name</label>
                            <input type="text" name="name" value={addForm.name} onChange={handleAddFormChange} autoComplete="off" style={{width: '100%', padding: '8px', borderRadius: 5, border: '1px solid #ccc'}} />
                            {addSubmitted && !addForm.name && <span style={{color: "red", fontSize: 12}}>Name is required!</span>}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: 320}}>
                            <label style={{marginBottom: 4, fontWeight: 500}}>Email</label>
                            <input type="email" name="email" value={addForm.email} onChange={handleAddFormChange} autoComplete="off" style={{width: '100%', padding: '8px', borderRadius: 5, border: '1px solid #ccc'}} />
                            {addSubmitted && !addForm.email && <span style={{color: "red", fontSize: 12}}>Email is required!</span>}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: 320}}>
                            <label style={{marginBottom: 4, fontWeight: 500}}>Year</label>
                            <input type="text" name="year" value={addForm.year} onChange={handleAddFormChange} autoComplete="off" style={{width: '100%', padding: '8px', borderRadius: 5, border: '1px solid #ccc'}} />
                            {addSubmitted && !addForm.year && <span style={{color: "red", fontSize: 12}}>Year is required!</span>}
                        </div>
                        <button className="std-sub-button" type="submit" style={{width: 180, marginTop: 10}}>Submit</button>
                    </form>
                </div>
            </ReactModal>
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
