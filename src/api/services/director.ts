import { local } from "../base";
import { toast } from "react-toastify";

interface Department {
	_id: string;
	count: number;
}

interface Branches {
	session: [String];
	branch: String;
}

export const getFacultyAttendance = async (
	employeeCode: string,
	startDate: Date,
	endDate: Date,
	subjectId?: string
) => {
	const payload = {
		employeeCode,
		startDate,
		endDate: endDate ? Date.now() : null,
		...(subjectId ? { subjectId } : {}),
	};
	const response = await local.post("/api/faculty/facultyAttendance", payload);
	console.log(
		"These are the attendance details of the faculty : ",
		response.data
	);
	return response.data;
};



export const getDepartments = async (): Promise<Department[]> => {
	const response = await local.get("/api/director/getDepartments");
	console.log("These are the available departments : ", response.data);
	return response.data;
};

export const getBranches = async (): Promise<Branches[]> => {
	const response = await local.get("/api/director/getBranches");
	console.log("These are the available branches : ", response.data);
	return response.data;
};

// Retrieves the faculty details and also the timetable of the faculty
export const getFacultyDetails = async (employeeCode: string) => {
	const response = await local.get(`/api/faculty/details?employeeCode=${employeeCode}`);
	console.log("These are the  details of the faculty : ", response.data);
	return response.data;
};

export const getSubjectsAccToSection = async(branch:string ,session:string ,section:string) => {
	const response = await local.get(`/api/director/getSubjectsAccToSection?branch=${branch.trim()}&session=${session.trim()}&section=${section.trim()}`);
	console.log(`These are the subjects according to the ${branch } ${section} ${session} : `, response.data);
	return response.data;
}

export const ownerIdToEmpMap = async()=>{
	const response = await local.get(`/api/director/ownerIdToEmp`);
	console.log("These are the ownerId to emp map : ", response.data.result);
	//The data object inturn consists of the array with the name as result so we tend to directly return it 
	return response.data.result;
}

local.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const { status } = error.response;
			if (
				(status === 404 || status === 400) &&
				error.response.data?.error === "Employee not found"
			) {
				toast.error("Employee not found. Please check the faculty code.");
			} else if ([400, 403, 404].includes(status)) {
				toast.error(
					`Error ${status}: ${
						error.response.data?.message ?? "Something went wrong"
					}`
				);
			}
		}
		return Promise.reject(error);
	}
);
