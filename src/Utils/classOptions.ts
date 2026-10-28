// Derives the cascading semester → branch → section → subject options
// for the faculty class report from one list of timetable sessions.

export interface ClassSession {
    semester?: string;
    branch?: string;
    section?: string;
    subject?: { _id?: string; subjectName?: string };
}

export interface SubjectOption {
    id: string;
    name: string;
}

const unique = (values: (string | undefined)[]) =>
    [...new Set(values.filter((v): v is string => Boolean(v)))];

export function getSemesterOptions(sessions: ClassSession[]): string[] {
    return unique(sessions.map(s => s.semester));
}

export function getBranchOptions(sessions: ClassSession[], semester: string): string[] {
    return unique(sessions.filter(s => s.semester === semester).map(s => s.branch));
}

export function getSectionOptions(sessions: ClassSession[], semester: string, branch: string): string[] {
    return unique(
        sessions
            .filter(s => s.semester === semester && s.branch === branch)
            .map(s => s.section)
    );
}

export function getSubjectOptions(
    sessions: ClassSession[],
    semester: string,
    branch: string,
    section: string
): SubjectOption[] {
    // Keyed by subject id so a subject taught in several slots appears once.
    const subjects = new Map<string, SubjectOption>();
    sessions
        .filter(s => s.semester === semester && s.branch === branch && s.section === section)
        .forEach(s => {
            if (s.subject?._id && s.subject?.subjectName) {
                subjects.set(s.subject._id, { id: s.subject._id, name: s.subject.subjectName });
            }
        });
    return [...subjects.values()];
}
