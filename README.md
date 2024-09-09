---

# Student Results Management System

This project is a **Student Results Management System** built using **React.js** for the frontend and **Express.js** with a **MySQL** database for the backend. The system allows administrators to manage exams, student details and marks, providing an efficient way to track academic performance.

## Features

### Exam Management
- Add new exams with details like course code, exam name, year, and pass/fail criteria.
- Delete exams and view existing ones in a scrollable table.
- Filter exams based on `course_code` and `exam_name`.

### Student Management
- View student details (ID, name, class, year, email).
- Display distinct class numbers based on selected years and list students per class.
- Perform regex validation on student details (ID, class number, year, etc.).

### Marks Management
- Input and update marks for students.
- Calculate the highest, lowest, and average marks for any exam.
- Perform validations to prevent negative values (except -1 for absentees).
- Edit and update existing marks for individual students.

### Dashboard
- Display an overview of the system's data including:
  - Total number of students and exams.
  - Pass/fail statistics for each year.
  - Pass percentage calculation.
  
### Data Handling
- Relational database schema designed with foreign keys and cascading deletes to maintain data integrity.
- Backend API routes to retrieve student and exam details, manage marks, and retrieve pass/fail statistics.
- Use Axios to send GET/POST requests from the frontend.

## Project Structure

- **Frontend**: Built using React.js. Features reusable components, React Router, hooks (`useEffect`, `useState`), and CSS for styling.
- **Backend**: Powered by Express.js, with endpoints handling student data, exam data, and statistical queries.
- **Database**: MySQL database with tables for students, exams, and marks, ensuring referential integrity using foreign keys.

## Key Queries

- Year-wise pass/fail statistics:
```sql
SELECT 
    sd.year,
    SUM(CASE WHEN m.marks >= e.min_marks THEN 1 ELSE 0 END) AS passCount,
    SUM(CASE WHEN m.marks < e.min_marks AND m.marks != -1 THEN 1 ELSE 0 END) AS failCount
FROM Marks m
JOIN Exams e ON m.course_code = e.course_code AND m.exam_name = e.exam_name
JOIN Student_details sd ON m.ID = sd.ID
GROUP BY sd.year
ORDER BY sd.year;
```

## Technologies Used

- **Frontend**: React.js, Bootstrap, Axios
- **Backend**: Express.js, MySQL
- **Database**: MySQL with relational schema
- **Version Control**: Git & GitHub

## How to Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/student-results-management-system.git
   cd student-results-management-system
   ```

2. **Install dependencies**:
   - For backend:
     ```bash
     cd backend
     npm install
     ```
   - For frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Set up MySQL database**:
   - Create a database and import the provided schema in the `/db/schema.sql` file.

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Run the frontend**:
   ```bash
   npm run dev
   ```

## Future Enhancements

- Implement authentication for the admin dashboard.
- Add more complex reporting and analytics for academic performance.
- Add support for exporting data as CSV or PDF.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
