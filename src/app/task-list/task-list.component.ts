import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Sevices/task.service'; // Adjust path as per your project structure
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/Sevices/notify.service';
interface Employee {
  email: string;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  Alltasks: any[] = []; // Assuming tasks are of type any[]
  displayBasic!: boolean;
  CreateTaskForm: FormGroup;
  allEmployeeData: Employee[] = [];
  selectedEmployee: Employee | null = null;
  managerEmail:any;
  managerId:any;


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private notifyservice: NotifyService
  ) {
    this.CreateTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assignedTo: ['', [Validators.required, Validators.email]], // or you might need a different setup if you want to handle objects
      createdBy: [{ value:'' }, [Validators.required, Validators.email]],
      creationDate: ['', Validators.required],
      isCompleted: [false,[Validators.required]],
      uploadedFile: ['No',[Validators.required]],
      completionDate: ['0001-01-01T00:00:00.000Z',[Validators.required]],
      managerId: [{ value:'' }, Validators.required]
    });
  }


  ngOnInit(): void {
    this.GetAssignTasks();
    this.GetAllManagedEmployees();
  }

  showBasicDialog() {
    this.displayBasic = true;
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
        uploadedFile: "No",
        managerId:this.managerId
      });

      this.taskService.createTask(this.CreateTaskForm.value).subscribe((response: any) => {
         if(response.statusMessage == "success")
         {
          this.notifyservice.showSuccess();
          this.GetAssignTasks();
          this.displayBasic = false;
          this.CreateTaskForm.reset();
          this.CreateTaskForm.patchValue({
            createdBy: this.managerEmail,
            managerId:this.managerId
          });
        }
        },
        (error:any) => {
          console.error('Error creating task:', error);
          this.notifyservice.showError();
        }
      );

    }
    // Add form submission logic here
  GetAssignTasks() {
    this.taskService.GetAssignTasks().subscribe(
      (data: any[]) => {
        this.Alltasks = data; // Assuming data is an array of tasks
      },
      (error:any) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  GetAllManagedEmployees() {
    this.taskService.GetAllManagedEmployees().subscribe((data: any) => {
      this.managerEmail=data.manager.email;
      this.managerId=data.manager.managerId;
      this.CreateTaskForm.patchValue({
        createdBy: this.managerEmail,
        managerId:this.managerId
      });
      this.allEmployeeData = data.employees
        .filter((email: string) => email !== this.managerEmail) // Exclude manager's email
        .map((email: string) => ({ email })); // Map to Employee interface
    });
  }
}
