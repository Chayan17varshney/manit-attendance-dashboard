import base from "../base";
import { local } from "../base";
import { toast, ToastContainer } from "react-toastify";

// These are the api functions which interact with the backend
// They are used by the components to fetch and send data

export const getOverallAttendance = async (scholarNumber: string) => {
	try {
		const response = await base.post("/api/attendance/attendanceByScholarId", {
			scholarNumber,
		});
		// toast.success("Overall attendance data fetched successfully!", {
		// 	toastId: "overall-success",
		// 	autoClose: 5000,
		// 	closeOnClick: true,
		// });
		return response.data;
	} catch (error) {
		console.error("Error fetching overall attendance:", error);
		toast.error("Failed to fetch overall attendance", {
			toastId: "overall-error",
		});
		throw error;
	}
};

export const getMonthlyAttendance = async (scholarNumber: string) => {
	try {
		const response = await local.post("/api/student/attendance/monthly", {
			scholarNumber,
		});
		console.log(response.data);
		toast.success("Monthly attendance data fetched successfully!", {
			toastId: "monthly-success", // Updated toastId
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching monthly attendance:", error);
		toast.error("Failed to fetch monthly attendance", {
			toastId: "monthly-error",
		});
		throw error;
	}
};

export const getStudentDetails = async (
	scholarNumber: string,
	semester: string
) => {
	try {
		const response = await local.post("/api/student/details", {
			scholarNumber,
			semester,
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching student details:", error);
		toast.error("Failed to fetch student details", {
			toastId: "student-error",
		});
		throw error;
	}
};
