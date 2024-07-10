import React from "react"; 
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";



export default function AddExam(){

    const initialValues= {
        examname: "",
        classno: "",
        maxmarks: "",
        minmarks: "",        
    }

    const validationSchema = Yup.object().shape({
        examname: Yup.string().required("You must input a name!"),
        classno: Yup.number().required("You must input a class number!"),
        maxmarks: Yup.number().required("You must input the max. marks!"),
        minmarks: Yup.number().required("You must input the min. marks!")
    });

    const onSubmit = (data) =>{
        console.log(data);
        axios.post("http://localhost:8801/createexam", data).then((response) => {
            console.log("IT DID WORK!");
        });
    };

    return(
        <div>
            <h1 className="title">Add a new Exam </h1>

            <div className="CreateExam">
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} >
                    <Form className="formContainer">
                        <label>Exam Name</label>
                        <ErrorMessage name="examname" component="span"/>
                        <Field id="inputexamname" name="examname" placeholder="Enter exam name" />

                        <label>Class No.</label>
                        <ErrorMessage name="classno" component="span"/>
                        <Field id="inputclassno" name="classno" placeholder="Enter class no." />
                        
                        <label>Maximum Marks</label>
                        <ErrorMessage name="maxmarks" component="span"/>
                        <Field id="inputmaxmarks" name="maxmarks" placeholder="Enter max. marks" />

                        <label>Minimum Marks</label>
                        <ErrorMessage name="minmarks" component="span"/>
                        <Field id="inputminmarks" name="minmarks" placeholder="Enter min. marks" />

                        <button type="submit"> Create Exam </button>
                    </Form>
                </Formik>
            </div>
        </div>
        
    )
};