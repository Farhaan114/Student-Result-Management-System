import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../navbar/AdminHome.css"
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalExams, setTotalExams] = useState(0);
    const [yearStats, setYearStats] = useState([]);

    const navigate = useNavigate();
    const handleClick = (path) => {
      navigate(path);
    }

    useEffect(() => {
        // Fetch total number of students
        axios.get('http://localhost:8801/totalStudents')
            .then(response => setTotalStudents(response.data.totalStudents))
            .catch(error => console.error('Error fetching total students:', error));

        // Fetch total number of exams
        axios.get('http://localhost:8801/totalExams')
            .then(response => setTotalExams(response.data.totalExams))
            .catch(error => console.error('Error fetching total exams:', error));

        // Fetch pass/fail statistics for each year
        axios.get('http://localhost:8801/yearlyPassFailStats')
            .then(response => setYearStats(response.data))
            .catch(error => console.error('Error fetching year stats:', error));
    }, []);

    return (
        <div>
            <div className='Box-Container'>
                <div className='caution-message'>
                    <p> Welcome to the Student Results Management Portal </p>
                    <p> </p>
                </div>
            </div>
            <h1 className='title1'> ADMIN DASHBOARD </h1>
            
            <div className="dashboard-container">
                <div className="dashboard-summary">
                    <div className="summary-box">
                        <h3>Total Students</h3>
                        <p>{totalStudents}</p>
                    </div>
                    <div className="summary-box">
                        <h3>Total Exams</h3>
                        <p>{totalExams}</p>
                    </div>
                </div>

                <div className="yearly-stats-container">
                    {yearStats.map((year, index) => (
                        <div key={index} className="year-box">
                            <h4>Year {year.year}</h4>
                            <p>Pass: {year.passCount}</p>
                            <p>Fail: {year.failCount}</p>
                            <p>Pass Percentage: </p>
                            {year.passPercentage}%
                        </div>
                    ))}
                </div>
                <div className='buttonbox'>
                    <button className='add-std-btn' onClick={() => handleClick("/ManageResults")}>Manage Exams</button>
                    <button className='add-std-btn' onClick={() => handleClick("/ManageStudents")}>View Student Details</button>
                </div>
            </div>
        </div>
    );
}
