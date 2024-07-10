import Axios from "axios";

export const ShowStudentList = async () =>{
    try{
        const response = await fetch(
            "http://localhost:8801/studentdeets"
        , {method: "GET",

        });
        return await response.json();
    }
    catch (error) {
        throw error;
    }
};

// export const submitFormtoServer = async () => {
//     try{
//         const response = await Axios.post(
//             "http://localhost:8801/insertstudent",

//             rollno

//         )
//     }
// }
