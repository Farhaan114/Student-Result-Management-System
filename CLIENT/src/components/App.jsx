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
import Footer from "./Footer";
import DeleteExam from "./pages/DeleteExam";
import DeleteStudent from "./pages/DeleteStudent";



function App() {



  return (

    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/ResultsPage" element={<ResultsPage />} />
          <Route path="/" element={<AdminHome />} />
          <Route path="/ManageStudents" element={<ManageStudents />} />
          <Route path="/ManageResults" element={<ManageResults />} />
          <Route path="/AddStudent" element={<AddStudent />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/GetResult/:ID" element={<GetResult />} />
          <Route path="/AddExam" element={<AddExam />} />
          <Route path="/ViewExam/:course_code" element={<ViewExam />} />
          <Route path="/DeleteExam" element={<DeleteExam />} />
          <Route path="/DeleteStudent" element={<DeleteStudent />} />


          
        </Routes>
      </main>
      <Footer />
    </Router>




  );
}

export default App;
