import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Sevices/task.service'; // Adjust path as per your project structure

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; // Assuming tasks are of type any[]

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data) => {
        this.tasks = data; // Assuming data is an array of tasks
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
}
