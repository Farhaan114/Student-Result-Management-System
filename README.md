---

# Student Results Management System

This project is a **Student Results Management System** built using **React.js** for the frontend and **Express.js** with a **MySQL** database for the backend. The system allows administrators to manage exams, student details and marks, providing an efficient way to track academic performance.

## Features

### Dashboard
- A landing page for the admin to quickly see system data:
  - Total number of students and exams.
  - Pass/fail statistics for each year.
  - Pass percentage calculation.

  ![Dashboard](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/ADMINHOME.png)

### Exam Management
---
![ManageExams](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/ManageExams.png)

- Add new exams with details like course code, exam name, year, and pass/fail criteria.
- Form Validation is also done with dynamic notifications.
 ![Add an exam](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/ExamCreated.png)
 ![Form validation](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/form%20validation.png)


- Delete exams and view existing ones in a scrollable table.
 ![Delete an exam](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/Delete%20exam.png)

- Filter exams based on `course_code` and `exam_name`.
 ![Filter courses](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/search%20by%20course_code.png)


### Student Details
- Display distinct class numbers based on selected years and list students per class.
 ![Display classes in each year](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/View%20classes%20in%20years.png)

- View student details (ID, name, class, year, email).
- A modal will be displayed that displays all the students in a class with a 'pop-up' effect.
 ![Class Details](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/Class%20Details.png)


### Marks Management
- Input and update marks for students.
- Display the highest, lowest, and average marks for any exam.
 ![ExamMarks](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/ExamMarks.png)
- Perform validations to prevent negative values (except -1 for absentees).
   ![NegativeChecker](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/negativemarks.png)
- Edit and update existing marks for individual students.
 ![Search by ID](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/search%20for%20id.png)
 ![Enter Marks](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/enter%20marks.png)


### Result Retrieval by the Students
-Enter student ID
 ![Student landing page](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/Students%20Landing%20Page.png)

-Results display
 ![Result Retrieval](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/Result%20retireval.png)


### Screen Responsiveness
- Screen Responsiveness done for different Resolutions
---
  ![Responsiveness](https://github.com/Farhaan114/Student-Result-Management-System/blob/master/screenshots/Responsiveness.png)


### Data Handling
- Relational database schema designed with foreign keys and cascading deletes to maintain data integrity.
- Backend API routes to retrieve student and exam details, manage marks, and retrieve pass/fail statistics.
- Use Axios to send GET/POST requests from the frontend.

## Project Structure

- **Frontend**: Built using React.js. Features reusable components, React Router, hooks (`useEffect`, `useState`), and CSS for styling.
- **Backend**: Powered by Express.js, with endpoints handling student data, exam data, and statistical queries.
- **Database**: MySQL database with tables for students, exams, and marks, ensuring referential integrity using foreign keys.


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
     cd SERVER
     npm install
     ```
   - For frontend:
     ```bash
     cd CLIENT
     npm install
     ```

3. **Set up MySQL database**:
   - Create a database and import the provided schema in the `/SERVER/schema.sql` file.

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
