export interface createTask{
    taskId: number; // Use number instead of 0
    title: string;
    description: string;
    assignedTo: string;
    createdBy: string;
    creationDate: Date; // Use Date for datetime
    isCompleted: boolean; // Use boolean instead of Boolean
    uploadedFile: string; // Fixed typo from 'uplodedfile' to 'uploadedFile'
    completionDate: Date; // Use Date for datetime
    managerId: number; // Use number instead of 0
}