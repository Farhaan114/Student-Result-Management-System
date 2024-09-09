const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
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

    const check = "SELECT * FROM students WHERE rollno = ? OR name = ?";
    db.query(check, [rollno, name], (err, result) => {
        if(err) {
            console.log(err);
            res.send("Error occured during search check");
            return;
        }

        if(result.length > 0){
            
            return res.status(422).json({Error: "Student already exists!!!"});
        }

        else{
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
    const classNo = req.body.classno;
    const classno = parseInt(classNo, 10);
    const tableName = `${examname}`;
    const dbName = 'srms';

    const check = `SELECT EXISTS (
            SELECT *
            FROM information_schema.tables
            WHERE table_schema = ?
              AND table_name = ?
        ) AS tableExists;`;

    db.query(check, [dbName, tableName], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).send("An error occurred while checking for the table.");
        }
        if(result[0].tableExists){
            return res.status(422).json({Error: "Exam already exists!"});
        }
        else{
            const create = `CREATE TABLE \`${tableName}\`(classno INT, rollno INT PRIMARY KEY, name VARCHAR(100), marks INTEGER);`;
            

            db.query(create, (err, result) => {
                if(err){
                    console.log(err);
                    return res.status(500).send("An error occurred while creating the exam table.");
                }

                const insert = `INSERT INTO \`${tableName}\`(rollno, name) SELECT rollno, name FROM students WHERE classno=?;`;

                db.query(insert, [classno], (err, result) => {
                    if(err){
                        console.log(err);
                        return res.status(500).send("An error occurred while inserting student records into the exam table.");
                    }
                    
                    const map_insert = `INSERT INTO exam_mapping (classno, examname) VALUES (?, ?);`;

                    db.query(map_insert, [classno, tableName], (err, result) => {
                        if(err){
                            console.log(err);
                            return res.status(500).send("An error occurred while inserting record into the exam_mapping table.");
                        }
                        return res.status(200).send("Exam created and student records inserted successfully.");
                    });
                });
            });
        }
    });
});


app.post('/trigger-refresh', (req, res) => {
    const examName = req.body.examname; // Assuming the exam name is sent in the body
  
    // Prepare the call to the stored procedure
    const sqlQuery = `
      CALL SyncStudentsWithExamByName(?);
    `;
  
    // Execute the stored procedure
    db.query(sqlQuery, [examName], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send('An error occurred while triggering the procedure.');
      }
  
      res.send('Procedure triggered successfully.');
    });
  });



app.get("/resultdeets", (req, res) => {
    const select = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME NOT LIKE 'exam_mapping%' AND TABLE_NAME NOT LIKE 'students%'";
    db.query(select, (err, result) => {
        if(err){
            console.error(err);
            res.status(500).send("An Error occurred");
        }
        else{
            console.log(result);
            res.json(result);
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


   let sanitizedMark;
   if (typeof mark === 'number') {
       sanitizedMark = Math.round(mark); // Round to nearest integer
   } else if (typeof mark === 'string') {
       const parsedInt = parseInt(mark, 10);
       if (!isNaN(parsedInt)) {
           sanitizedMark = parsedInt; // Convert string to integer if valid
       } else {
           return res.status(400).send("Invalid mark format");
       }
   } else {
       return res.status(400).send("Invalid mark format");
   }


   const saveMark = `UPDATE ${examname} SET marks = ${sanitizedMark} WHERE rollno = '${rollno}';`; 
   db.query('UPDATE ?? SET marks = ? WHERE rollno = ?', [examname, sanitizedMark, rollno], (err,result) => {
    if (err) {
        console.error(err);
        res.send("An error occurred.");
    } else {
        console.log(`Affected Rows: ${result.affectedRows}`);
        if (result.affectedRows === 0) {
            return res.send("No rows updated. Check roll number and exam name.");
        }
        res.send(result);
    }
   })
})


app.listen(8801, () => {
             console.log("server running on port./");
             console.log("server call");
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
