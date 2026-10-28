export interface Branch {
    program: string;
    course: string;
    shortForm: string;
    duration: number;
}

export interface ParsedBranch extends Branch {
    status: 'valid' | 'invalid' | 'duplicate';
    error?: string;
}

// Validates rows parsed from a bulk-import file against each other and
// against the branches that already exist in the department.
export function validateBranches(data: Branch[], existingBranches: Branch[]): ParsedBranch[] {
    return data.map((branch, index) => {
        if (!branch.program || !branch.course || !branch.shortForm) {
            return {
                ...branch,
                status: 'invalid' as const,
                error: 'Missing required fields'
            };
        }

        // Check for duplicates in current data
        const isDuplicate = data.findIndex(
            (d, i) => i !== index && d.shortForm === branch.shortForm
        ) !== -1;

        // Check against existing branches
        const exists = existingBranches.some(
            b => b.shortForm === branch.shortForm
        );

        let status: 'valid' | 'invalid' | 'duplicate' = 'valid';
        if (isDuplicate) status = 'duplicate';
        if (exists) status = 'invalid';

        return {
            ...branch,
            status,
            error: isDuplicate ? 'Duplicate branch code' : exists ? 'Branch already exists' : undefined
        };
    });
}
