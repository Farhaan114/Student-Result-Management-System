const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Import Sequelize models
const db = require("./models");
const { Student, Exam, Mark, sequelize } = db;

// SHOWS ALL THE EXAMS IN A LIST
app.get("/showexams", async (req, res) => {
    try {
        const exams = await Exam.findAll({
            attributes: ["exam_name", "course_code", "year"]
        });
        res.json(exams);
    } catch (err) {
        console.error(err);
        res.status(500).send("An Error occurred");
    }
});

// SHOWS NAME OF AN EXAM FROM A LIST
app.get("/showexamname/:course_code", async (req, res) => {
    try {
        const { course_code } = req.params;
        const exam = await Exam.findOne({
            where: { course_code },
            attributes: ["exam_name"]
        });
        if (exam) {
            res.json(exam.exam_name);
        } else {
            res.status(404).send("Exam name not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An Error occurred");
    }
});

// SHOW THE MAX MARKS AND MIN MARKS OF A PARTICULAR EXAM
app.get("/showExamMarks/:course_code", async (req, res) => {
    try {
        const { course_code } = req.params;
        const exam = await Exam.findOne({
            where: { course_code },
            attributes: ["max_marks", "min_marks"]
        });
        if (exam) {
            res.json({ max_marks: exam.max_marks, min_marks: exam.min_marks });
        } else {
            res.status(404).send("Marks data not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

// Shows all the students who have written a particular exam
app.get("/showOneExam/:course_code", async (req, res) => {
    try {
        const { course_code } = req.params;
        // 1. Find the exam to get the year
        const exam = await Exam.findOne({ where: { course_code } });
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        // 2. Get all students in that year, left join with Mark for this exam
        const students = await Student.findAll({
            where: { year: exam.year },
            attributes: ["ID", "name", "email", "year"],
            include: [{
                model: Mark,
                required: false,
                where: {
                    course_code: course_code,
                    exam_name: exam.exam_name
                },
                attributes: ["marks"]
            }]
        });
        // 3. Format the result
        const result = students.map(s => ({
            ID: s.ID,
            Name: s.name,
            Year: s.year,
            Marks: s.Marks[0] ? s.Marks[0].marks : null // or "N/A"
        }));
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Database error occurred" });
    }
});

// Create an exam with its details
app.post('/insertExam', async (req, res) => {
    try {
        let { course_code, exam_name, year, max_marks, min_marks } = req.body;
        // Coerce to numbers
        const min = Number(min_marks);
        const max = Number(max_marks);
        const yr = Number(year);
        if (isNaN(min) || isNaN(max) || isNaN(yr)) {
            return res.status(400).send({ message: 'Invalid number input.' });
        }
        if (min > max) {
            return res.status(400).send({ message: 'Minimum marks cannot be greater than maximum marks.' });
        }
        const [exam, created] = await Exam.findOrCreate({
            where: { course_code, exam_name, year: yr },
            defaults: { max_marks: max, min_marks: min }
        });
        if (!created) {
            return res.status(409).send({ message: 'Exam already exists.' });
        }
        res.status(200).send({ message: 'Exam inserted successfully.' });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send({ message: 'An error occurred.', error: err.message });
    }
});

// For updating/pre-filling the Marks table after each new exam insert
app.post('/insertIntoMarks', async (req, res) => {
    try {
        // For each student in the same year as the exam, create a Mark if not exists
        const exams = await Exam.findAll();
        for (const exam of exams) {
            const students = await Student.findAll({ where: { year: exam.year } });
            for (const student of students) {
                await Mark.findOrCreate({
                    where: {
                        ID: student.ID,
                        course_code: exam.course_code,
                        exam_name: exam.exam_name
                    },
                    defaults: { marks: null }
                });
            }
        }
        res.send({ message: 'Initial marks records inserted successfully.' });
    } catch (err) {
        console.error('Error inserting initial marks:', err);
        res.status(500).send({ message: 'Failed to insert initial marks.', error: err.message });
    }
});

// Enter/Update Marks for a student in one exam
app.put('/updateStudentMarks', async (req, res) => {
    try {
        const { studentId, courseCode, examName, marks } = req.body;
        if (!studentId || !courseCode || !examName || marks === undefined) {
            return res.status(400).send({ message: 'All fields are required.' });
        }
        const [mark, created] = await Mark.findOrCreate({
            where: { ID: studentId, course_code: courseCode, exam_name: examName },
            defaults: { marks }
        });
        if (!created) {
            mark.marks = marks;
            await mark.save();
        }
        res.send({ message: 'Student marks updated successfully.' });
    } catch (err) {
        console.error('Error updating student marks:', err);
        res.status(500).send({ message: 'Failed to update student marks.', error: err.message });
    }
});

// Retrieve results for one student upon entering the ID number
app.get('/getStudentMarks/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        const marks = await Mark.findAll({
            where: { ID },
            attributes: ["course_code", "exam_name", "marks"]
        });
        const transformedResult = marks.map(mark => ({
            CourseCode: mark.course_code,
            ExamName: mark.exam_name,
            Marks: mark.marks !== null ? mark.marks : "N/A"
        }));
        res.send(transformedResult);
    } catch (err) {
        console.error(err);
        res.send("an error occurred.");
    }
});

// Retrieve student details
app.get('/getStudentDetails/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        const student = await Student.findOne({
            where: { ID },
            attributes: ["ID", "classNo", "name", "email", "year"]
        });
        if (!student) return res.status(404).send([]);
        res.send([student]);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred.");
    }
});

// For getting the number of years
app.get('/getYears', async (req, res) => {
    try {
        const years = await Student.findAll({
            attributes: [[sequelize.literal("CONCAT('year ', year)"), 'year_name']],
            group: ['year'],
            order: [[sequelize.literal('year_name'), 'ASC']]
        });
        res.json(years);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('An error occurred while fetching the years.');
    }
});

// For getting the distinct classes
app.get('/getClassNo/:year', async (req, res) => {
    try {
        const yearParam = req.params.year;
        const year = yearParam.replace('year ', '');
        if (isNaN(year) || year.trim() === '') {
            return res.status(400).json({ error: 'Invalid year parameter' });
        }
        const classes = await Student.findAll({
            where: { year },
            attributes: [[sequelize.col('classNo'), 'classNo']],
            group: ['classNo']
        });
        res.json(classes);
    } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).json({ error: 'An error occurred while fetching class numbers' });
    }
});

// Get the students of a particular class in a particular year
app.get('/getStudents/:classNo/:year', async (req, res) => {
    try {
        const classNo = parseInt(req.params.classNo, 10);
        const yearParam = req.params.year;
        const year = yearParam.replace('year ', '');
        if (isNaN(year) || year.trim() === '' || isNaN(classNo)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }
        const students = await Student.findAll({
            where: { classNo, year },
            attributes: ["ID", "classNo", "name", "email", "year"]
        });
        res.json(students);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Database query error' });
    }
});

// Delete an exam
app.delete('/deleteExam/:course_code/:exam_name', async (req, res) => {
    try {
        const { course_code, exam_name } = req.params;
        const result = await Exam.destroy({ where: { course_code, exam_name } });
        if (result === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json({ message: 'Exam deleted successfully' });
    } catch (err) {
        console.error('Failed to delete exam:', err);
        res.status(500).json({ error: 'Failed to delete exam' });
    }
});

// Insert a student into the table
app.post('/AddStudent', async (req, res) => {
    try {
        const { ID, classNo, name, email, year } = req.body;
        if (!ID || !classNo || !name || !email || !year) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const [student, created] = await Student.findOrCreate({
            where: { ID, email },
            defaults: { classNo, name, year }
        });
        if (!created) {
            return res.status(422).json({ error: 'Student already exists' });
        }
        res.status(201).json({ message: 'Student added successfully', result: student });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'An error occurred while inserting data' });
    }
});

// Delete a student
app.delete('/deleteStudent', async (req, res) => {
    try {
        const studentId = req.body.id;
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }
        const result = await Student.destroy({ where: { ID: studentId } });
        if (result === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// To get the pass/fail percentages for each year
app.get('/yearlyPassFailStats', async (req, res) => {
    try {
        const stats = await sequelize.query(`
            SELECT 
                sd.year,
                SUM(CASE WHEN m.marks >= e.min_marks AND m.marks != -1 THEN 1 ELSE 0 END) AS passCount,
                SUM(CASE WHEN m.marks < e.min_marks AND m.marks != -1 THEN 1 ELSE 0 END) AS failCount,
                COUNT(CASE WHEN m.marks != -1 THEN 1 END) AS totalCount
            FROM marks m
            JOIN exams e ON m.course_code = e.course_code AND m.exam_name = e.exam_name
            JOIN student_details sd ON m.ID = sd.ID
            GROUP BY sd.year
            ORDER BY sd.year;
        `, { type: sequelize.QueryTypes.SELECT });
        const yearStats = stats.map(row => {
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
    } catch (err) {
        console.error('Error fetching pass/fail statistics:', err);
        res.status(500).send('Server error');
    }
});

// Endpoint to get the total number of students
app.get('/totalStudents', async (req, res) => {
    try {
        const totalStudents = await Student.count();
        res.json({ totalStudents });
    } catch (error) {
        console.error('Failed to retrieve total students:', error);
        res.status(500).json({ error: 'Failed to retrieve total students' });
    }
});

// Endpoint to get the total number of exams
app.get('/totalExams', async (req, res) => {
    try {
        const totalExams = await Exam.count({
            distinct: true,
            col: 'course_code'
        });
        res.json({ totalExams });
    } catch (error) {
        console.error('Failed to retrieve total exam results:', error);
        res.status(500).json({ error: 'Failed to retrieve total exam results' });
    }
});

app.listen(8801, () => {
    console.log("server running on port 8801");
});


