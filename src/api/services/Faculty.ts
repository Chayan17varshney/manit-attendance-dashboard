import { local } from "../base";


export const getEmpCode = async (empName : string ) => {

    try {
        const response = await local.post(`/api/faculty/nameToEmpCode`,{name:empName});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching Employee Code:", error);
        throw error;
    }

}

export  const   getClassReport = async (employeeCode : string, subjectId : string, branch : string, section : string) => {
    try {
        const  res =  await local.post(`/api/faculty/classReport`,{employeeCode,subjectId,branch,section});
        console.log(`This is the class report of the faculty with the ${employeeCode} employee code : ${res.data}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching Class Report:", error);
        throw error;

    }
}


export const getTimetable = async (empCode : string) => {
    try{
        const res= await local.get(`/api/faculty/timetable?empCode=${empCode}`);
        console.log(`This is the timetable of the faculty with the ${empCode} employee code : ${res.data}`);
        return res.data;
    }catch(error){
        console.error("Error fetching Timetable:", error);
        throw error;
    }
}

