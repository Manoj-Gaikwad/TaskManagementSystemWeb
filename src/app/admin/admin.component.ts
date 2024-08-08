import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { TableModule } from 'primeng/table';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  performanceData: any;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadPerformanceData();
  }

  loadPerformanceData(): void {
    this.taskService.getMonthWisePerformance().subscribe(
      data => {
        this.performanceData = data;
 },
      error => {
        console.error('Error fetching performance data', error);
      }
    );
  }
}
