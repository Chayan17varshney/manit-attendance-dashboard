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

        // Already in the department: reject every copy.
        const exists = existingBranches.some(
            b => b.shortForm === branch.shortForm
        );
        if (exists) {
            return { ...branch, status: 'invalid' as const, error: 'Branch already exists' };
        }

        // Repeated within the file: keep the first copy, flag the later ones.
        const isDuplicate = data.findIndex(
            d => d.shortForm === branch.shortForm
        ) < index;
        if (isDuplicate) {
            return { ...branch, status: 'duplicate' as const, error: 'Duplicate branch code' };
        }

        return { ...branch, status: 'valid' as const };
    });
}
