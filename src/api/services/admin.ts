import base, { local } from "../base";

const api = local; // Use 'base' for production or 'local' for development

// =========== DEPARTMENT MANAGEMENT ===========

/**
 * Get all departments
 * @returns List of departments
 */
export const getDepartments = async () => {
	try {
		const response = await api.get("/api/admin/departments");
		console.log("Departments fetched successfully:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching departments:", error);
		throw error;
	}
};

/**
 * Get specific department details
 * @param departmentId Department ID
 * @returns Department details
 */
export const getDepartmentById = async (departmentId: string) => {
	try {
		const response = await api.get(`/api/admin/departments/${departmentId}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching department ${departmentId}:`, error);
		throw error;
	}
};

/**
 * Add a new department
 * @param departmentData Department data containing department name and code
 * @returns Response with status and message
 */
export const addDepartment = async (departmentData: {
	department: string;
	cn: string;
}) => {
	try {
		const response = await api.post("/api/admin/departments", departmentData);

		return response.data;
	} catch (error) {
		console.error("Error adding department:", error);
		throw error;
	}
};

/**
 * Add multiple departments at once
 * @param departmentsData Array of department objects
 * @returns Response with status and message
 */
export const addDepartmentsBulk = async (
	departmentsData: { department: string; cn: string }[]
) => {
	try {
		const response = await api.post("/api/admin/bulk-departments", {
			departments: departmentsData,
		});
		return response.data;
	} catch (error) {
		console.error("Error adding departments in bulk:", error);
		throw error;
	}
};

/**
 * Update a department
 * @param departmentId Department ID
 * @param updatedData Updated department data
 * @returns Response with status and message
 */
export const updateDepartment = async (
	departmentId: string,
	updatedData: { department?: string; cn?: string }
) => {
	try {
		const response = await api.put(
			`/api/admin/departments/${departmentId}`,
			updatedData
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating department ${departmentId}:`, error);
		throw error;
	}
};

/**
 * Delete a department
 * @param departmentId Department ID to delete
 * @returns Response with status and message
 */
export const deleteDepartment = async (departmentId: string) => {
	try {
		const response = await api.delete(`/api/admin/departments/${departmentId}`);
		return response.data;
	} catch (error) {
		console.error(`Error deleting department ${departmentId}:`, error);
		throw error;
	}
};

// =========== COURSE MANAGEMENT ===========

/**
 * Get courses by department
 * @param department Department code
 * @returns List of courses for the department
 */
export const getCoursesByDepartment = async (department: string) => {
	try {
		console.log("Getting the courses for department:", department);
		const response = await api.get(`/api/admin/departments/${department}`);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching courses for department ${department}:`,
			error
		);
		throw error;
	}
};

/**
 * Add course to a department
 * @param courseData Data containing department and course details
 * @returns Response with status and message
 */
export const addCourse = async (courseData: {
	departmentId: string;
	courseName: string;
	courseType: string;
	duration: number;
}) => {
	try {
		const response = await api.post("/api/admin/courseType", courseData);
		return response.data;
	} catch (error) {
		console.error("Error adding course:", error);
		throw error;
	}
};

/**
 * Update a course
 * @param courseId Course ID
 * @param updatedData Updated course data
 * @returns Response with status and message
 */
export const updateCourse = async (
	courseId: string,
	updatedData: { name?: string }
) => {
	try {
		const response = await api.put(
			`/api/admin/courses/${courseId}`,
			updatedData
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating course ${courseId}:`, error);
		throw error;
	}
};

/**
 * Delete a course and all its related branches
 * @param departmentId Department ID
 * @param courseName Course name to delete
 * @returns Response with status and message
 */
export const deleteCourse = async (
	departmentId: string,
	courseName: string
) => {
	try {
		const response = await api.delete(
			`/api/admin/departments/${departmentId}/courses/${courseName}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error deleting course ${courseName}:`, error);
		throw error;
	}
};

// =========== SESSION MANAGEMENT ===========

/**
 * Get sessions by course
 * @param department Department code
 * @param course Course name
 * @returns List of sessions for the course
 */
export const getSessionsByCourse = async (
	department: string,
	course: string
) => {
	try {
		const response = await api.get(
			`/api/admin/sessions?department=${department}&course=${course}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching sessions for ${course} in ${department}:`,
			error
		);
		throw error;
	}
};

/**
 * Add sessions to branches
 * @param sessionData Session data containing departmentId and branchSessions
 * @returns Response with status and message
 */
export const addSession = async (sessionData: {
	departmentId: string;
	branchSessions: Array<{
		branchShortForm: string;
		sessions: string[];
	}>;
}) => {
	try {
		const response = await api.post("/api/admin/sessions", sessionData);
		return response.data;
	} catch (error) {
		console.error("Error adding session:", error);
		throw error;
	}
};

/**
 * Delete a session from a branch
 * @param departmentId Department ID
 * @param branchShortForm Branch short form
 * @param session Session to delete
 * @returns Response with status and message
 */
export const deleteSession = async (
	departmentId: string,
	branchShortForm: string,
	session: string
) => {
	try {
		const response = await api.delete(
			`/api/admin/departments/${departmentId}/branches/${branchShortForm}/sessions/${session}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error deleting session ${session}:`, error);
		throw error;
	}
};

// =========== BRANCH MANAGEMENT ===========

/**
 * Get branches by department, course and session
 * @param department Department code
 * @param course Course name
 * @param session Session year range (e.g., "2022-26")
 * @returns List of branches
 */
export const getBranches = async (
	department: string,
	course: string,
	session: string
) => {
	try {
		const response = await api.get(
			`/api/admin/branches?department=${department}&course=${course}&session=${session}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching branches for ${course} ${session} in ${department}:`,
			error
		);
		throw error;
	}
};

/**
 * Add branches to a department
 * @param branchData Branch data containing departmentId and branches
 * @returns Response with status and message
 */
export const addBranch = async (branchData: {
	departmentId: string;
	branches: Array<{
		program: string;
		course: string;
		shortForm: string;
		duration: number;
	}>;
}) => {
	try {
		const response = await api.post("/api/admin/branch", branchData);
		return response.data;
	} catch (error) {
		console.error("Error adding branch:", error);
		throw error;
	}
};

/**
 * Delete a branch from a department
 * @param departmentId Department ID
 * @param branchShortForm Branch short form to delete
 * @returns Response with status and message
 */
export const deleteBranch = async (
	departmentId: string,
	branchShortForm: string
) => {
	try {
		const response = await api.delete(
			`/api/admin/departments/${departmentId}/branches/${branchShortForm}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error deleting branch ${branchShortForm}:`, error);
		throw error;
	}
};

// =========== APPROVALS MANAGEMENT ===========

/**
 * Fetch all session approval requests
 * @returns List of session approval requests
 */
export const getSessionApprovalRequests = async () => {
	try {
		const response = await api.get("/api/approvals/session/requests");
		return response.data;
	} catch (error) {
		console.error("Error fetching session approval requests:", error);
		throw error;
	}
};

/**
 * Fetch all branch approval requests
 * @returns List of branch approval requests
 */
export const getBranchApprovalRequests = async () => {
	try {
		const response = await api.get("/api/approvals/branch/requests");
		return response.data;
	} catch (error) {
		console.error("Error fetching branch approval requests:", error);
		throw error;
	}
};

/**
 * Mark a session request as read
 * @param requestId ID of the session request to mark as read
 * @returns Response with status and message
 */
export const markSessionRequestAsRead = async (requestId: string) => {
	try {
		const response = await api.put(
			`/api/approval/session/read-status/${requestId}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error marking session request ${requestId} as read:`, error);
		throw error;
	}
};

/**
 * Mark a branch request as read
 * @param requestId ID of the branch request to mark as read
 * @returns Response with status and message
 */
export const markBranchRequestAsRead = async (requestId: string) => {
	try {
		const response = await api.put(
			`/api/approval/branch/read-status/${requestId}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error marking branch request ${requestId} as read:`, error);
		throw error;
	}
};

/**
 * Process a session request (approve or reject)
 * @param requestId ID of the session request to process
 * @param action Action to take (approve or reject)
 * @param reason Reason for rejection (required if action is reject)
 * @returns Response with status and message
 */
export const processSessionRequest = async (
	requestId: string,
	action: "approve" | "reject",
	reason?: string
) => {
	try {
		const response = await api.put("/api/approvals/session/process", {
			requestId,
			action,
			reason: action === "reject" ? reason : undefined,
		});
		return response.data;
	} catch (error) {
		console.error(`Error processing session request ${requestId}:`, error);
		throw error;
	}
};

/**
 * Process a branch request (approve or reject)
 * @param requestId ID of the branch request to process
 * @param action Action to take (approve or reject)
 * @param reason Reason for rejection (required if action is reject)
 * @returns Response with status and message
 */
export const processBranchRequest = async (
	requestId: string,
	action: "approve" | "reject",
	reason?: string
) => {
	try {
		const response = await api.put("/api/approvals/branch/process", {
			requestId,
			action,
			reason: action === "reject" ? reason : undefined,
		});
		return response.data;
	} catch (error) {
		console.error(`Error processing branch request ${requestId}:`, error);
		throw error;
	}
};

// =========== SEMESTER CONFIGURATION ===========

/**
 * Set semester configuration (even or odd)
 * @param semesterType "even" or "odd"
 * @returns Response with status and message
 */
export const configureSemester = async (semesterType: "even" | "odd") => {
	try {
		const response = await api.post("/api/admin/semester", {
			semesterType,
		});
		return response.data;
	} catch (error) {
		console.error(`Error configuring semester as ${semesterType}:`, error);
		throw error;
	}
};

/**
 * Get current semester status
 * @returns Current semester configuration (even or odd)
 */
export const getSemesterStatus = async () => {
	try {
		const response = await api.get("/api/admin/semester");
		return response.data;
	} catch (error) {
		console.error("Error fetching semester status:", error);
		throw error;
	}
};

// =========== FACULTY MANAGEMENT ===========

/**
 * Get faculty list by department
 * @param department Department code
 * @returns List of faculty members
 */
export const getFacultyByDepartment = async (department: string) => {
	try {
		const response = await api.get(
			`/api/faculty/list?department=${department}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching faculty for department ${department}:`,
			error
		);
		throw error;
	}
};

/**
 * Add faculty members
 * @param facultyData Data containing department and faculty members
 * @returns Response with status and message
 */
export const addFaculty = async (facultyData: {
	department: string;
	faculty: Array<{
		name: string;
		employeeCode: string;
		email: string;
		phone: string;
		abbreviation: string;
		role: string;
	}>;
}) => {
	try {
		const response = await api.post("/api/admin/faculty", facultyData);
		return response.data;
	} catch (error) {
		console.error("Error adding faculty:", error);
		throw error;
	}
};

/**
 * Update faculty details
 * @param employeeCode Faculty employee code
 * @param updatedData Updated faculty data
 * @returns Response with status and message
 */
export const updateFaculty = async (
	employeeCode: string,
	updatedData: {
		name?: string;
		email?: string;
		phone?: string;
		abbreviation?: string;
		role?: string;
		department?: string;
	}
) => {
	try {
		const response = await api.put(
			`/api/admin/faculty/${employeeCode}`,
			updatedData
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating faculty ${employeeCode}:`, error);
		throw error;
	}
};

// =========== SUBJECT MANAGEMENT ===========

/**
 * Get subjects by department
 * @param department Department code
 * @returns List of subjects
 */
export const getSubjectsByDepartment = async (department: string) => {
	try {
		const response = await api.get(
			`/api/admin/subjects?department=${department}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching subjects for department ${department}:`,
			error
		);
		throw error;
	}
};

/**
 * Add a subject
 * @param subjectData Subject data
 * @returns Response with status and message
 */
export const addSubject = async (subjectData: {
	subjectCode: string;
	subjectName: string;
	department: string;
	isElective: boolean;
}) => {
	try {
		const response = await api.post("/api/admin/subjects", subjectData);
		return response.data;
	} catch (error) {
		console.error("Error adding subject:", error);
		throw error;
	}
};

/**
 * Add multiple subjects at once
 * @param subjectsData Array of subject objects
 * @returns Response with status and message
 */
export const addSubjectsBulk = async (subjectsData: {
	subjects: Array<{
		subjectCode: string;
		subjectName: string;
		department: string;
		isElective: boolean;
	}>;
}) => {
	try {
		const response = await api.post("/api/admin/subjects", subjectsData);
		return response.data;
	} catch (error) {
		console.error("Error adding subjects in bulk:", error);
		throw error;
	}
};

/**
 * Update a subject
 * @param subjectId Subject ID
 * @param updatedData Updated subject data
 * @returns Response with status and message
 */
export const updateSubject = async (
	subjectId: string,
	updatedData: {
		subjectName?: string;
		subjectCode?: string;
		department?: string;
		isElective?: boolean;
	}
) => {
	try {
		const response = await api.put(
			`/api/admin/subjects/${subjectId}`,
			updatedData
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating subject ${subjectId}:`, error);
		throw error;
	}
};

/**
 * Update multiple subjects
 * @param subjectUpdates Array of subject update objects
 * @returns Response with status and message
 */
export const updateSubjectsBulk = async (subjectUpdates: {
	subjectUpdates: Array<{
		subjectCode: string;
		subjectName?: string;
		department?: string;
		isElective?: boolean;
	}>;
}) => {
	try {
		const response = await api.put("/api/admin/subjects", subjectUpdates);
		return response.data;
	} catch (error) {
		console.error("Error updating subjects in bulk:", error);
		throw error;
	}
};

// =========== TIMETABLE MANAGEMENT ===========

/**
 * Add timetable entries
 * @param timetableData Timetable data
 * @returns Response with status and message
 */
export const addTimetable = async (timetableData: {
	department: string;
	course: string;
	branch: string;
	session: string;
	entries: Array<{
		subjectCode: string;
		day: string;
		timing: string;
		location: string;
		employeeCode: string;
		section: string;
		semester: string;
	}>;
}) => {
	try {
		const response = await api.post("/api/admin/timetable", timetableData);
		return response.data;
	} catch (error) {
		console.error("Error adding timetable:", error);
		throw error;
	}
};

/**
 * Get timetable by class
 * @param department Department code
 * @param course Course name
 * @param branch Branch name
 * @param session Session year range
 * @param section Section identifier
 * @returns Timetable for the specified class
 */
export const getTimetableByClass = async (
	department: string,
	course: string,
	branch: string,
	session: string,
	section: string
) => {
	try {
		const response = await api.get(
			`/api/admin/timetable?department=${department}&course=${course}&branch=${branch}&session=${session}&section=${section}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching timetable for ${branch} ${section} ${session}:`,
			error
		);
		throw error;
	}
};

// =========== STUDENT MANAGEMENT ===========

/**
 * Add student
 * @param studentData Student data
 * @returns Response with status and message
 */
export const addStudent = async (studentData: {
	scholarNumber: string;
	StudentName: string;
	branch: string;
	section: string;
	batch: string;
	department: string;
}) => {
	try {
		const response = await api.post("/api/admin/students", studentData);
		return response.data;
	} catch (error) {
		console.error("Error adding student:", error);
		throw error;
	}
};

/**
 * Add multiple students
 * @param studentsData Array of student objects
 * @returns Response with status and message
 */
export const addStudentsBulk = async (studentsData: {
	students: Array<{
		scholarNumber: string;
		StudentName: string;
		branch: string;
		section: string;
		batch: string;
		department: string;
	}>;
}) => {
	try {
		const response = await api.post("/api/admin/students/bulk", studentsData);
		return response.data;
	} catch (error) {
		console.error("Error adding students in bulk:", error);
		throw error;
	}
};

/**
 * Update student details
 * @param scholarNumber Student scholar number
 * @param updatedData Updated student data
 * @returns Response with status and message
 */
export const updateStudent = async (
	scholarNumber: string,
	updatedData: {
		StudentName?: string;
		branch?: string;
		section?: string;
		batch?: string;
		department?: string;
	}
) => {
	try {
		const response = await api.put(
			`/api/admin/students/${scholarNumber}`,
			updatedData
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating student ${scholarNumber}:`, error);
		throw error;
	}
};

/**
 * Update multiple students at once
 * @param studentUpdates Array of student update objects
 * @returns Response with status and message
 */
export const updateStudentsBulk = async (studentUpdates: {
	studentUpdates: Array<{
		scholarNumber: string;
		StudentName?: string;
		branch?: string;
		section?: string;
		batch?: string;
		department?: string;
	}>;
}) => {
	try {
		const response = await api.put("/api/admin/students", studentUpdates);
		return response.data;
	} catch (error) {
		console.error("Error updating students in bulk:", error);
		throw error;
	}
};

/**
 * Get students by class
 * @param department Department code
 * @param course Course name
 * @param branch Branch name
 * @param session Session year range
 * @param section Section identifier
 * @returns List of students for the specified class
 */
export const getStudentsByClass = async (
	department: string,
	course: string,
	branch: string,
	session: string,
	section: string
) => {
	try {
		const response = await api.get(
			`/api/admin/students?department=${department}&course=${course}&branch=${branch}&session=${session}&section=${section}`
		);
		return response.data;
	} catch (error) {
		console.error(
			`Error fetching students for ${branch} ${section} ${session}:`,
			error
		);
		throw error;
	}
};
