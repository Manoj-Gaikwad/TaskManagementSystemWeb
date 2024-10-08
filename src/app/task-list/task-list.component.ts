import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../Sevices/task.service'; // Adjust path as per your project structure
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/Sevices/notify.service';
import { Upload } from 'src/Models/upload';
import { AuthService } from '../../Sevices/auth.service';
import { createTask } from 'src/Models/createTask';
import { Customer } from 'src/Models/customer';
import { Representative } from 'src/Models/customer';
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';
interface Employee {
  email: string;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  Alltasks: createTask[] = []; // Assuming tasks are of type any[]
  displayBasic!: boolean;
  CreateTaskForm: FormGroup;
  allEmployeeData: Employee[] = [];
  selectedEmployee: Employee | null = null;
  managerEmail: any;
  managerId: any;
  uploadedFiles: any;
  displayUpload!: boolean;
  upload!: Upload;
  uploadDataForm!: FormGroup;
  selectedFile: any;
  File: any;
  Role: any;
  updateBasic!: boolean;
  UpdateTaskForm!: FormGroup;
  updateTask!: any;
  updateSelectedEmployee: Employee[] = [];
  Task!: createTask;
  updateTaskId: any;
  loading: boolean = true;
  representatives!: Representative[];
  statuses!: any[];

  @ViewChild('dt') table!: Table;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private notifyservice: NotifyService,
    private authService: AuthService
  ) {
    this.CreateTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]], // or you might need a different setup if you want to handle objects
      createdBy: [''],
      creationDate: [''],
      isCompleted: [false],
      uploadedFile: ['No'],
      completionDate: ['0001-01-01T00:00:00.000Z'],
      managerId: [''],
    });

    this.UpdateTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]], // or you might need a different setup if you want to handle objects
      createdBy: [''],
      managerId: [''],
    });

    this.uploadDataForm = this.fb.group({
      File: ['', [Validators.required]],
      isComplited: [true, [Validators.required]],
      FileUpload: ['Yes', [Validators.required]],
      TaskId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.GetAssignTasks();
    this.GetAllManagedEmployees();
    this.authService.userInfo.subscribe((data: any) => {
      this.Role = data.roles;
    });
  }

  isFileUploaded(): boolean {
    return this.Alltasks?.some((task) => task.uploadedFile !== 'Yes');
  }

  isupdatetask() {
    return this.Alltasks?.some(
      (task) => task.uploadedFile !== 'Yes' || this.Role == 'Manager'
    );
  }

  clear(table: Table) {
    table.clear();
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.table.filterGlobal(inputElement.value, 'contains');
  }

  onDateSelect(value: any) {
    this.table.filter(this.formatDate(value), 'date', 'equals');
  }

  formatDate(date: any) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return date.getFullYear() + '-' + month + '-' + day;
  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  onBasicUpload(event: any) {
    this.notifyservice.showSuccess();
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  uploadFileDialog(TId: any) {
    this.displayUpload = true;
    this.uploadDataForm.patchValue({
      TaskId: TId,
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.File = event.target.files[0];
  }

  submitUpdateForm(data: any) {
    const file = this.uploadDataForm.get('File')?.value;
    this.upload = {
      File: this.File,
      isComplited: this.uploadDataForm.get('isComplited')?.value,
      FileUpload: this.uploadDataForm.get('FileUpload')?.value,
      TaskId: this.uploadDataForm.get('TaskId')?.value,
    };

    this.taskService.uploadDocument(this.upload).subscribe((response: any) => {
      if (response == 'File uploaded successfully') {
        this.displayUpload = false;
        this.notifyservice.showSuccess();
        this.GetAssignTasks();
      } else {
        this.notifyservice.showError();
      }
    });
  }

  submitForm(data: any) {
    const currentDate = new Date().toISOString();
    const assignedToEmail = data.value.assignedTo?.email || '';
    this.CreateTaskForm.patchValue({
      title: data.value.title,
      description: data.value.description,
      assignedTo: assignedToEmail,
      createdBy: this.managerEmail,
      creationDate: currentDate,
      isCompleted: false,
      uploadedFile: 'No',
      managerId: this.managerId,
    });

    this.taskService.createTask(this.CreateTaskForm.value).subscribe(
      (response: any) => {
        if (response.statusMessage == 'success') {
          this.notifyservice.showSuccess();
          this.GetAssignTasks();
          this.displayBasic = false;
          this.CreateTaskForm.reset();
          this.CreateTaskForm.patchValue({
            createdBy: this.managerEmail,
            managerId: this.managerId,
          });
        }
      },
      (error: any) => {
        console.error('Error creating task:', error);
        this.notifyservice.showError();
      }
    );
  }

  GetAssignTasks() {
    this.taskService.GetAssignTasks().subscribe(
      (data: any[]) => {
        this.Alltasks = data;
        this.Alltasks = this.sortTasksDescending(this.Alltasks);
        this.loading = false; // Assuming data is an array of tasks
      },
      (error: any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  sortTasksDescending(tasks: any[]): any[] {
    return tasks.sort(
      (a, b) =>
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    );
  }

  GetAllManagedEmployees() {
    this.taskService.GetAllManagedEmployees().subscribe((data: any) => {
      this.managerEmail = data.manager.email;
      this.managerId = data.manager.managerId;
      this.CreateTaskForm.patchValue({
        createdBy: this.managerEmail,
        managerId: this.managerId,
      });

      this.allEmployeeData = data.employees
        .filter((email: string) => email !== this.managerEmail) // Exclude manager's email
        .map((email: string) => ({ email })); // Map to Employee interface
    });
  }

  getTaskDetails(data: any) {
    this.updateBasic = true;
    this.updateTaskId = data;
    this.taskService.GetTaskById(data).subscribe((response: any) => {
      const employee: Employee = { email: response.assignedTo || '' };
      if (employee.email) {
        // Ensure email is valid before pushing
        this.updateSelectedEmployee = [{ email: employee.email }]; // Replace array with the new employee
      } else {
        this.notifyservice.showError();
      }
      if (response != null) {
        this.UpdateTaskForm.patchValue({
          title: response.title,
          description: response.description,
          assignedTo: this.updateSelectedEmployee[0],
          createdBy: response.createdBy,
          managerId: response.managerId,
        });
        this.UpdateTaskForm.updateValueAndValidity();
        this.GetAssignTasks();
      } else {
        this.notifyservice.showError();
      }
    });
  }

  Updatetask(data: any) {
    const assignedToEmail = data.value.assignedTo?.email || '';
    this.UpdateTaskForm.patchValue({
      title: data.value.title,
      description: data.value.description,
      assignedTo: assignedToEmail,
      createdBy: this.managerEmail,
      managerId: this.managerId,
    });
    this.Task = this.UpdateTaskForm.value;
    this.Task.taskId = this.updateTaskId;
    this.taskService.updateTask(this.Task).subscribe((response: any) => {
      var res = response;
      if (res != null) {
        this.updateBasic = false;
        this.notifyservice.showSuccess();
        this.GetAssignTasks();
      } else {
        this.notifyservice.showError();
      }
    });
  }

  get f() {
    return this.CreateTaskForm.controls;
  }

  get j() {
    return this.UpdateTaskForm.controls;
  }
}
