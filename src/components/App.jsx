import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";  
import ManageStudents from "./pages/ManageStudents";
import AdminHome from "./pages/AdminHome";
import ManageResults from "./pages/ManageResults";  
import ResultsPage from "./pages/ResultsPage";
import AddStudent from "./pages/AddStudent";
import Login from "./pages/Login";
import GetResult from "./pages/GetResult"; 
import AddExam from "./pages/AddExam";
import ViewExam from "./pages/ViewExam";



function App() {



  return (

    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/ResultsPage" element={<ResultsPage />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/ManageStudents" element={<ManageStudents />} />
          <Route path="/ManageResults" element={<ManageResults />} />
          <Route path="/AddStudent" element={<AddStudent />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/GetResult" element={<GetResult />} />
          <Route path="/AddExam" element={<AddExam />} />
          <Route path="/ViewExam/:examname" element={<ViewExam />} />
          
        </Routes>
      </main>
    </Router>




  );
}

export default App;
