const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const router = express.Router();
const util = require("util");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // for MIddlewares 

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));




const db = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "sudopw",
    database: "srms"
});

db.query = util.promisify(db.query).bind(db);



// SHOWS ALL THE EXAMS IN A LIST - works -done 
app.get("/showexams", (req, res) => {
    const select = "SELECT exam_name, course_code, year from EXAMS";
    db.query(select, (err, result) => {
        if(err){
            console.error(err);
            res.status(500).send("An Error occurred");
        }
        else{
            const exams = result.map(exam => ({
                course_code: exam.course_code,
                exam_name: exam.exam_name,
                year: exam.year
            }));
            res.json(exams);
        }
    })
})

// SHOWS NAME OF AN EXAM FROM A LIST - works -done
app.get("/showexamname/:course_code", (req, res) => {
    
    const course_code = req.params.course_code;

    const select = "SELECT exam_name from EXAMS WHERE course_code = '"+`${course_code}`+"' ;";
    db.query(select, (err, result) => {
        if(err){
            console.error(err);
            res.status(500).send("An Error occurred");
        }
        else{
            if (result.length > 0) {
                const examname = result[0].exam_name;
                res.json(examname);
            } else {
                res.status(404).send("Exam name not found");
            }
        }
    });
});

//SHOW THE MAX MARKS AND MIN MARKS OF A PARTICULAR EXAM  -works -done
app.get("/showExamMarks/:course_code", (req, res) => {
    const course_code = req.params.course_code;

    const select = "SELECT max_marks, min_marks FROM EXAMS WHERE course_code = ?";
    db.query(select, [course_code], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("An error occurred");
        } else {
            if (result.length > 0) {
                const { max_marks, min_marks } = result[0];
                res.json({ max_marks, min_marks });
            } else {
                res.status(404).send("Marks data not found");
            }
        }
    });
});


// shows all the students who have written a particular exam. - WORKS -done
app.get("/showOneExam/:course_code", (req, res) => {
    const CourseCode = req.params.course_code;
    console.log(`Received course code: ${CourseCode}`);

    console.log(`${CourseCode}`);
    
    const exam = "SELECT s.ID, s.name, s.email, s.year, m.marks FROM Student_details s JOIN Marks m ON s.ID = m.ID WHERE m.course_code = '"+`${CourseCode}`+"';";

    db.query(exam, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send({ message: "Database error occurred" });
        } else {

            console.log("result:", result);
            const exam = result.map(exam => ({
                ID: exam.ID,
                Name: exam.name,
                Year: exam.year,
                Marks: exam.marks
            })); 
            res.json(exam);
        }
    });
});




// to create an exam with its details - WORKS -done
app.post('/insertExam', async (req, res) => {
    try {
        const { course_code, exam_name, year, max_marks, min_marks } = req.body;

        // Validation checks for max_marks and min_marks
        if (min_marks > max_marks) {
            console.log("check2");
            return res.status(400).send({ message: 'Minimum marks cannot be greater than maximum marks.' });
        }

        // Check if the exam already exists
        const checkQuery = `
            SELECT * FROM Exams WHERE course_code = ? AND exam_name = ? AND year = ?
        `;
        const checkParams = [course_code, exam_name, year];

        const [existingExam] = await db.promise().query(checkQuery, checkParams);

        if (existingExam.length > 0) {
            // Exam already exists
            return res.status(409).send({ message: 'Exam already exists.' });
        }

        // Insert the exam if it doesn't exist
        const insertQuery = `
            INSERT INTO Exams (course_code, exam_name, year, max_marks, min_marks) VALUES (?, ?, ?, ?, ?)
        `;
        const insertParams = [course_code, exam_name, year, max_marks, min_marks];

        const [result] = await db.promise().query(insertQuery, insertParams);

        res.status(200).send({ message: 'Exam inserted successfully.', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send({ message: 'An error occurred.', error: err.message });
    }
});


// For updating/pre-filling the Marks table after each new exam insert. -works -done 
app.post('/insertIntoMarks', async (req, res) => {
    try {
        const insertMarksQuery = `
            INSERT INTO Marks (ID, course_code, exam_name, marks)
            SELECT 
                s.ID, 
                e.course_code, 
                e.exam_name, 
                NULL AS marks
            FROM 
                Student_details s
            JOIN 
                Exams e ON s.year = e.year
            WHERE 
                NOT EXISTS (
                    SELECT 1
                    FROM Marks m
                    WHERE m.ID = s.ID
                      AND m.course_code = e.course_code
                      AND m.exam_name = e.exam_name
                )
        `;

        const result = db.query(insertMarksQuery);

        console.log('Inserted initial marks records:', result);

        res.send({ message: 'Initial marks records inserted successfully.' });
    } catch (err) {
        console.error('Error inserting initial marks:', err);
        res.status(500).send({ message: 'Failed to insert initial marks.', error: err.message });
    }
});



// Enter/Update Marks for a student in one exam -WORKS -done
app.put('/updateStudentMarks', async (req, res) => {
    try {
        const { studentId, courseCode, examName, marks } = req.body;

        if (!studentId || !courseCode || !examName || !marks) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        const updateQuery = `
            INSERT INTO Marks (ID, course_code, exam_name, marks)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                marks = VALUES(marks)
        `;

        const params = [studentId, courseCode, examName, marks];

        const result = db.query(updateQuery, params);

        if (result.affectedRows === 0) {
            return res.send({ message: 'No changes made. Student ID and course code combination does not exist.' });
        }

        res.send({ message: 'Student marks updated successfully.', affectedRows: result.affectedRows });
    } catch (err) {
        console.error('Error updating student marks:', err);
        res.status(500).send({ message: 'Failed to update student marks.', error: err.message });
    }
});


// Retrieve results for one student upon entering the ID number. -WORKS -done
app.get('/getStudentMarks/:ID', async (req, res) => {
    
        const { ID } = req.params;

        console.log(`Fetching marks for student ${ID}`);

        const query = `
            SELECT course_code, exam_name, marks
            FROM Marks
            WHERE ID = ${ID}
        `;

        db.query(query, (err,result) => {
            if(err){
                console.error(err);
                res.send("an error occurred.");
            }
            else{
                const transformedResult = result.map(mark => ({
                    CourseCode: mark.course_code,
                    ExamName: mark.exam_name,
                    Marks: mark.marks ? mark.marks : "N/A" // Handling cases where marks might be null
                }));
                res.send(transformedResult);
            }
        });
});


// Retrieve student details - WORKS -done
app.get('/getStudentDetails/:ID', async (req, res) => {

    const { ID } = req.params;

    console.log(`Fetching student details for ${ID}`);


    const query = `
        SELECT ID, classNo, name, email, year
        FROM Student_details
        WHERE ID = ?;
    `;

    db.query(query, [ID], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("An error occurred.");
        } else {
            const transformedResult = result.map(studentDetails => ({
                ID: studentDetails.ID,
                classNo: studentDetails.classNo,
                Name: studentDetails.name,
                Email: studentDetails.email,
                Year: studentDetails.year
            }));
            res.send(transformedResult);
        }
    });
});

//for getting the number of years -WORKS -done
app.get('/getYears', (req, res) => {
    const query = `
        SELECT DISTINCT CONCAT('year ', year) AS year_name 
        FROM student_details 
        ORDER BY year_name 
        LIMIT 0, 1000;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('An error occurred while fetching the years.');
        }
        res.json(results);
    });
});

// for getting the distinct classes -works -done
app.get('/getClassNo/:year', (req, res) => {

    const yearParam = req.params.year;
    const year = yearParam.replace('year ', ''); // Removing 'year '

    if (isNaN(year) || year.trim() === '') {
        return res.status(400).json({ error: 'Invalid year parameter' });
    }

    const query = 'SELECT DISTINCT classNo FROM student_details WHERE year = ?';
    
    db.query(query, [year], (error, results) => {
      if (error) {
        console.error('Database query error: ', error);
        return res.status(500).json({ error: 'An error occurred while fetching class numbers' });
      }
      
      res.json(results);
    });
  });


// get the students of a particular class in a particular year -WORKS -done
app.get('/getStudents/:classNo/:year', (req, res) => {
    const classNo = parseInt(req.params.classNo, 10);
    const yearParam = req.params.year;
    const year = yearParam.replace('year ', ''); // Removing 'year '
    
    if (isNaN(year) || year.trim() === '') {
        return res.status(400).json({ error: 'Invalid year parameter' });
    }

    if (isNaN(classNo) || isNaN(year)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const query = `
        SELECT ID, classNo, name, email, year
        FROM Student_details
        WHERE classNo = ? AND year = ?
    `;

    db.query(query, [classNo, year], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// delete an exam - WORKS -done
app.delete('/deleteExam/:course_code/:exam_name', (req, res) => {
    const { course_code, exam_name } = req.params;
    const deleteQuery = 'DELETE FROM Exams WHERE course_code = ? AND exam_name = ?';

    db.query(deleteQuery, [course_code, exam_name], (err, result) => {
        if (err) {
            console.error('Failed to delete exam:', err);
            return res.status(500).json({ error: 'Failed to delete exam' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.json({ message: 'Exam deleted successfully' });
    });
});


// !--- ADD STUDENT AND DELETE STUDENT FEATURES HAVE BEEN OMITTED DUE TO THEM NOT BEING APPROPRIATE USECASES FOR THE PROJECT ---!
// insert a student into the table. -WORKS -done
app.post('/AddStudent', (req, res) => {
    const { ID, classNo, name, email, year } = req.body;

    // Validate input
    if (!ID || !classNo || !name || !email || !year) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the student already exists
    const checkQuery = 'SELECT * FROM Student_details WHERE ID = ? OR email = ?';
    const checkValues = [ID, email];

    db.query(checkQuery, checkValues, (err, results) => {
        if (err) {
            console.error('Error checking if student exists:', err);
            return res.status(500).json({ error: 'An error occurred while checking student existence' });
        }

        if (results.length > 0) {
            // Student already exists
            return res.status(422).json({ error: 'Student already exists' });
        }

        // Student does not exist, proceed with insertion
        const insertQuery = 'INSERT INTO Student_details (ID, classNo, name, email, year) VALUES (?, ?, ?, ?, ?)';
        const insertValues = [ID, classNo, name, email, year];

        db.query(insertQuery, insertValues, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ error: 'An error occurred while inserting data' });
            }
            res.status(201).json({ message: 'Student added successfully', result });
        });
    });
});

app.delete('/deleteStudent', (req, res) => {
    const studentId = req.body.id;

    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    const deleteQuery = 'DELETE FROM Student_details WHERE ID = ?';

    db.query(deleteQuery, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Failed to delete student' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });
    });
});
// 

// To get the pass/fail percentages for each year 
app.get('/yearlyPassFailStats', (req, res) => {
    const query = `
        SELECT 
            sd.year,
            SUM(CASE WHEN m.marks >= e.min_marks AND m.marks != -1 THEN 1 ELSE 0 END) AS passCount,
            SUM(CASE WHEN m.marks < e.min_marks AND m.marks != -1 THEN 1 ELSE 0 END) AS failCount,
            COUNT(CASE WHEN m.marks != -1 THEN 1 END) AS totalCount
        FROM Marks m
        JOIN Exams e ON m.course_code = e.course_code AND m.exam_name = e.exam_name
        JOIN Student_details sd ON m.ID = sd.ID
        GROUP BY sd.year
        ORDER BY sd.year;
    `;
    

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching pass/fail statistics:', err);
            res.status(500).send('Server error');
        } else {
            // Calculate pass percentage
            const yearStats = results.map(row => {
                const total = row.totalCount;
                const passPercentage = total === 0 ? 0 : ((row.passCount / total) * 100).toFixed(2);
                return {
                    year: row.year,
                    passCount: row.passCount,
                    failCount: row.failCount,
                    passPercentage: parseFloat(passPercentage)
                };
            });
            res.json(yearStats);
        }
    });
});


// Endpoint to get the total number of students
app.get('/totalStudents', async (req, res) => {
    try {
        const results = await db.query('SELECT COUNT(*) AS totalStudents FROM Student_details');
        res.json({ totalStudents: results[0].totalStudents });
    } catch (error) {
        console.error('Failed to retrieve total students:', error);
        res.status(500).json({ error: 'Failed to retrieve total students' });
    }
});

// Endpoint to get the total number of exams
app.get('/totalExams', async (req, res) => {
    try {
        const results = await db.query('SELECT COUNT(DISTINCT course_code) AS totalExams FROM Exams;');
        res.json({ totalExams: results[0].totalExams });
    } catch (error) {
        console.error('Failed to retrieve total exam results:', error);
        res.status(500).json({ error: 'Failed to retrieve total exam results' });
    }
});




















app.listen(8801, () => {
    console.log("server running on port./");
    console.log("server call");
});


