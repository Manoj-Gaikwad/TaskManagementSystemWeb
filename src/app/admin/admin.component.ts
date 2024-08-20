import { Component, OnInit ,ViewChild} from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  performanceData: any;
  loading: boolean = true;
  selectedEmployee!: any[];

  @ViewChild('dt') table!: Table;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadPerformanceData();
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.table.filterGlobal(inputElement.value, 'contains');
  }
  
  onDateSelect(value:any) {
    this.table.filter(this.formatDate(value), 'date', 'equals')
  }

  formatDate(date:any) {
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
  clear(table: Table) {
    table.clear();
  }
}
