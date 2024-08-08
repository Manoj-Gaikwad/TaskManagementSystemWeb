import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
 allEmployeeList:any;
 getManagerWiseEmpList:any;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    // this.getAllEmployeeList();
    this.GetManagerWiseEmployee();
  }
  getAllEmployeeList(){
    this.taskService.getAllEmployeeList().subscribe((data:any)=>{
      this.allEmployeeList=data;
    })
  }
  GetManagerWiseEmployee(){
    this.taskService.GetManagerWiseEmployee().subscribe((data:any)=>{
      this.getManagerWiseEmpList=data;
    })
  }
}
