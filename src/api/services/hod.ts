import { local } from "../base";

export const nameToEmp = async(email:string)=>{
    try {
        const res = await local.post("/api/hod/emailToEmp", {email});
        console.log("This is the HOD DATA : ",res.data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const StudentOverall = async(scholarNumber : string , branch : string)=>{
    try {
        const res = await local.post("/api/student/studentOverallReport", {scholarNumber, branch});
        console.log("This is the Student Overall DATA : ",res.data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}