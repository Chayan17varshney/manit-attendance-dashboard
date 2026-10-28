import { local } from "../base";

export const getProfessorsByDepartment = async (departmentId: string) => {
	try {
		const response = await local.get(`/api/faculty/list?department=${departmentId}`);
		console.log(response.data);
        return response.data;
	} catch (error) {
		console.error("Error fetching professors:", error);
		throw error;
	}
};

export const getSubjectsByProfessor = async (professorId: string) => {
	try {
		const response = await local.get(`/api/faculty/Subjects?employeeCode=${professorId}`);
		console.log(response.data);
        return response.data;
	} catch (error) {
		console.error("Error fetching subjects:", error);
		throw error;
	}
};




