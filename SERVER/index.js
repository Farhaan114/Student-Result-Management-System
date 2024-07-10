const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const router = express.Router();
const bodyParser = require("body-parser");

const app = express();
// const db = require('./models');
app.use(bodyParser.json()); // for MIddlewares 

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// //ROUTERS
// const studentRouter = require("./routes/students");
// app.use("/students", studentRouter);


// db.sequelize.sync().then(() => {
//     app.listen(8801, () => {
//         console.log("server running on port./");
//     });
// });


const mysql2 = require("mysql2");

const db = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "sudopw",
    database: "srms"
});


app.post("/insertstudent", (req, res) => {
    const classno = req.body.classno;
    const rollno = req.body.rollno;
    const name = req.body.name;
    const email = req.body.email;

    const insert = 
        "INSERT INTO students (classno, rollno, name, email) VALUES (?, ?, ?, ?)";
    db.query(insert, [classno, rollno, name, email], (err, result) => {
        if(err) {
            console.error(err);
            res.send("Errror occurred.");
        }
        else{
            res.send("Hello Fraan; item inserted.");
            console.log(classno, rollno, name, email);
        }
    });
});

app.post("/deletestudent", (req, res) => {
    const rollno = req.body.rollno;

    const remove = "DELETE FROM students WHERE rollno="+rollno;

    db.query(remove, (err, result) => {
        if(err) {
            console.error(err);
            res.send("Errror occurred.");
        }
        else{
            res.send("Hello Fraan; item deleted.");
        }
    });
});

app.get("/studentdeets", (req, res) =>{
    const select = "SELECT * FROM students ORDER BY classno ASC, rollno ASC";
    db.query(select, (err, result) => {
        if(err){
            console.error(err);
            res.send("An Error occurred");
        }
        else{
            console.log(result);
            res.send(result);
        }
    })
})

app.post("/createexam", (req, res) => {
    const examname  = req.body.examname;
    const classno = req.body.classno;

    const tableName = `${examname}`;
    const classNo = `${classno}`;

    
    const create = "CREATE TABLE IF NOT EXISTS "+`${tableName}`+" (rollno INT PRIMARY KEY, name VARCHAR(100), marks INTEGER);";
    const insert =  "INSERT INTO "+`${tableName}`+" (rollno, name) SELECT rollno, name FROM students WHERE classno="+`${classNo}`+";";


    db.query(create, (err, result) => {
        if(err){
            console.log(err);
            res.send("An errorr occurred in creating.");
        }
        else{
            console.log(result);
            db.query(insert, (err, result) => {
                if(err){
                    console.log(err);
                    res.send("An errorr occurred in inserting.");
                }
                else{
                    console.log(result);
                    res.send(result);
                }
            });

        }
    });
});

app.get("/resultdeets", (req, res) => {
    const select = "SHOW tables";
    db.query(select, (err, result) => {
        if(err){
            console.error(err);
            res.send("An Error occurred");
        }
        else{
            console.log(result);
            res.send(result);
        }
    })
})

app.get("/examdeets/:examname", async (req, res) => {
    const examname = req.params.examname;
    const exam = "SELECT * FROM "+`${examname}`+";";
    db.query(exam, (err,result) => {
        if(err){
            console.error(err);
            res.send("an error occurred.");
        }
        else{
            console.log(result);
            res.send(result);
        }
    });
});




app.post("/marksave", async (req, res) => {
   const {rollno, examname, mark} = req.body;
   const saveMark = "UPDATE "+`${examname}`+" SET marks = "+`${mark}`+" WHERE rollno = "+`${rollno}`+"; "; 
   db.query(saveMark, (err,result) => {
    if(err){
        console.error(err);
        res.send("an error occurred.");
    }
    else{
        console.log(result);
        res.send(result);
    }
   })
})


app.listen(8801, () => {
             console.log("server running on port./");
});
















// app.use(cors());

// router.use(cors());

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "sudopw",
//     database: "srms"
// });

// router.get('/users', async (req, res) => {
//     const sql = "SELECT * FROM students";
//     db.query(sql, (err, data) => {
//         if(err) return res.json(err);
//         return res.json(data);
//     });
// });



// app.get('/', (req, res) => {
//     return res.json("From the backend");
// });

// app.listen(8801, () => {
//     console.log("listening on port.");
// });

// module.exports = router;



