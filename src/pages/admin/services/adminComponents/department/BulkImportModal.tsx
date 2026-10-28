import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Department, ParsedDepartment, UploadedFile } from '../../DepartmentTypes';
import { addDepartmentsBulk } from '../../../../../api/services/admin';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Chip,
    Alert,
    Box,
    Typography,
    Step,
    Stepper,
    StepLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface BulkImportModalProps {
    open: boolean;
    onClose: () => void;
    existingDepartments: Department[];
    onSuccess: () => void;
}

const steps = ['Upload Files', 'Preview Data', 'Submit'];

const BulkImportModal: React.FC<BulkImportModalProps> = ({
    open,
    onClose,
    existingDepartments,
    onSuccess
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [parsedDepartments, setParsedDepartments] = useState<ParsedDepartment[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCloseModal = () => {
        if (uploadedFiles.length > 0 && !isBulkSubmitting) {
            setShowWarningDialog(true);
        } else {
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setActiveStep(0);
        setUploadedFiles([]);
        setParsedDepartments([]);
        onClose();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, isDrag = false) => {
        const files = isDrag
            ? event.dataTransfer?.files
            : (event.target as HTMLInputElement).files;

        if (!files || files.length === 0) return;

        const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.length);
        if (uploadedFiles.length + newFiles.length > 5) {
            toast.warning(`You can only upload up to 5 files. Only the first ${5 - uploadedFiles.length} will be processed.`);
        }

        const tempFiles: UploadedFile[] = newFiles.map(file => ({
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: null,
            status: 'uploading'
        }));

        setUploadedFiles(prev => [...prev, ...tempFiles]);

        newFiles.forEach((file, index) => {
            processFile(file, tempFiles[index].id);
        });
    };

    const processFile = async (file: File, fileId: string) => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                let parsedData: Array<{ department: string; cn: string }> = [];
                const result = e.target?.result;

                if (!result) {
                    updateFileStatus(fileId, 'invalid', 'Failed to read file');
                    return;
                }

                switch (fileType) {
                    case 'json':
                        parsedData = JSON.parse(result as string);
                        break;
                    case 'csv':
                        parsedData = parseCSV(result as string);
                        break;
                    case 'xlsx':
                        parsedData = parseXLSX(result);
                        break;
                    default:
                        throw new Error('Unsupported file format');
                }

                if (parsedData.length === 0) {
                    updateFileStatus(fileId, 'invalid', 'No valid department data found');
                } else {
                    updateFileWithData(fileId, parsedData);
                }
            } catch (error) {
                console.error('Error processing file:', error);
                updateFileStatus(fileId, 'invalid', 'Failed to parse file');
            }
        };

        if (fileType === 'json' || fileType === 'csv') {
            reader.readAsText(file);
        } else if (fileType === 'xlsx') {
            reader.readAsBinaryString(file);
        } else {
            updateFileStatus(fileId, 'invalid', 'Unsupported file format');
        }
    };

    const parseCSV = (csvText: string): Array<{ department: string; cn: string }> => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        const deptIndex = headers.findIndex(h =>
            h === 'department' || h === 'department name'
        );
        const cnIndex = headers.findIndex(h =>
            h === 'cn' || h === 'code' || h === 'department code'
        );

        if (deptIndex === -1 || cnIndex === -1) {
            throw new Error('Invalid CSV format');
        }

        return lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = line.split(',').map(v => v.trim());
                return {
                    department: values[deptIndex],
                    cn: values[cnIndex]
                };
            });
    };

    const parseXLSX = (data: any): Array<{ department: string; cn: string }> => {
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        return jsonData.map((row: any) => ({
            department: row.department || row.Department || row['Department Name'] || '',
            cn: row.cn || row.CN || row.code || row.Code || row['Department Code'] || ''
        }));
    };

    const updateFileStatus = (fileId: string, status: 'uploading' | 'valid' | 'invalid', error?: string) => {
        setUploadedFiles(prev =>
            prev.map(file =>
                file.id === fileId ? { ...file, status, error } : file
            )
        );
    };

    const updateFileWithData = (fileId: string, data: any) => {
        setUploadedFiles(prev =>
            prev.map(file =>
                file.id === fileId ? { ...file, data, status: 'valid' } : file
            )
        );
    };

    const handleNext = () => {
        if (activeStep === 0) {
            const validFiles = uploadedFiles.filter(f => f.status === 'valid');
            if (validFiles.length === 0) {
                toast.error('Please upload at least one valid file');
                return;
            }

            const allData = validFiles.flatMap(f => f.data || []);
            validateData(allData);
        }
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (activeStep === 1) {
            setShowWarningDialog(true);
        } else {
            setActiveStep(prev => prev - 1);
        }
    };

    const validateData = (data: any[]) => {
        const validated = data.map((dept, index) => {
            if (!dept.department || !dept.cn) {
                return { ...dept, status: 'invalid' as const };
            }

            const isDuplicate = data.findIndex(
                (d, i) => i !== index && (d.department === dept.department || d.cn === dept.cn)
            ) !== -1;

            const existingConflict = existingDepartments.some(
                d => d.department === dept.department || d.cn === dept.cn
            );

            let status: 'valid' | 'duplicate' | 'exists' = 'valid';
            if (isDuplicate) status = 'duplicate';
            else if (existingConflict) status = 'exists';

            return { ...dept, status };
        });

        setParsedDepartments(validated);
    };

    const handleSubmit = async () => {
        const validDepartments = parsedDepartments.filter(d => d.status === 'valid');
        if (validDepartments.length === 0) {
            toast.error('No valid departments to submit');
            return;
        }

        setIsBulkSubmitting(true);
        try {
            await addDepartmentsBulk(validDepartments);
            toast.success(`Successfully added ${validDepartments.length} departments`);
            resetAndClose();
            onSuccess();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to add departments');
        } finally {
            setIsBulkSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <DialogContentText>
                            Upload files containing department data (up to 5 files).
                            Supported formats: Excel (.xlsx), CSV (.csv), or JSON (.json)
                        </DialogContentText>

                        <div
                            className={`flex flex-col items-center p-6 border-2 border-dashed rounded-lg transition-all
                                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragActive(false);
                                handleFileUpload(e, true);
                            }}
                        >
                            <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                            <p className="text-sm text-gray-600 mb-4">
                                Drag and drop files here or click to browse
                            </p>
                            <Button
                                variant="contained"
                                component="label"
                                disabled={uploadedFiles.length >= 5}
                            >
                                Choose Files
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept=".xlsx,.csv,.json"
                                    multiple
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>File Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {uploadedFiles.map(file => (
                                            <TableRow key={file.id}>
                                                <TableCell>{file.name}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={file.status}
                                                        color={file.status === 'valid' ? 'success' :
                                                            file.status === 'uploading' ? 'primary' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        onClick={() => {
                                                            setUploadedFiles(prev =>
                                                                prev.filter(f => f.id !== file.id)
                                                            );
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                );

            case 1:
                return (
                    <div>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Review the data before submitting. Remove any invalid entries if needed.
                        </Alert>

                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Department Name</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {parsedDepartments.map((dept, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{dept.department}</TableCell>
                                            <TableCell>{dept.cn}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={dept.status}
                                                    color={dept.status === 'valid' ? 'success' :
                                                        dept.status === 'duplicate' ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() => {
                                                        setParsedDepartments(prev =>
                                                            prev.filter((_, i) => i !== index)
                                                        );
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">
                                Valid: {parsedDepartments.filter(d => d.status === 'valid').length} |
                                Duplicates: {parsedDepartments.filter(d => d.status === 'duplicate').length} |
                                Invalid: {parsedDepartments.filter(d => d.status === 'exists').length}
                            </Typography>
                        </Box>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You are about to add {parsedDepartments.filter(d => d.status === 'valid').length} new departments.
                            This action cannot be undone.
                        </Alert>

                        <Typography variant="body1">
                            Please confirm that you want to proceed with adding these departments to the system.
                        </Typography>
                    </div>
                );
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddCircleOutlineIcon color="primary" />
                        <Typography>Bulk Import Departments</Typography>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ py: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {renderStepContent()}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    {activeStep > 0 && (
                        <Button onClick={handleBack}>Back</Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={activeStep === 0 && uploadedFiles.filter(f => f.status === 'valid').length === 0}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isBulkSubmitting || parsedDepartments.filter(d => d.status === 'valid').length === 0}
                        >
                            {isBulkSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog
                open={showWarningDialog}
                onClose={() => setShowWarningDialog(false)}
            >
                <DialogTitle>Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Going back will clear all uploaded files and parsed data. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowWarningDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setShowWarningDialog(false);
                            setActiveStep(0);
                            setUploadedFiles([]);
                            setParsedDepartments([]);
                        }}
                        color="error"
                    >
                        Yes, go back
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BulkImportModal;