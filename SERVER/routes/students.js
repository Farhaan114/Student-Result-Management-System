const express = require("express");
const router = express.Router();
const { students } = require("../models");

const cors = require("cors");
const mysql2 = require("mysql2");

const db = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "sudopw",
    database: "srms"
});





router.get("/", (req, res) => {
    res.json("helloe");
});

router.post("/", async (req,res) =>{
                                    //student is the student details received from front end.
    const Student = req.body;
    await students.create(Student);

    res.json(Student);
});



module.exports = router;