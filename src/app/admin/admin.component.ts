import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from 'src/Models/register';
import {chartData} from 'src/Models/chartData';

interface Month {
  name: string;
  code: number;
}
interface Role {
  name: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  EmployeeList: any;
  loading: boolean = true;
  selectedEmployee: any = null;
  months!: Month[];
  selectedMonth!: Month;
  displayBasic!: boolean;
  managerForm!: FormGroup;
  managerData!: Register;
  selectedCity!:Role;
  Roles!: Role[];
  chartdata!:chartData;

  currentEmail!:string;
  currentMonth!:any;
  completedCount = 0;
  notCompletedCount = 0;
  totalCount = 0;

  doughnutChartData: any;
  doughnutChartOptions: any;

  barChartData: any;
  barChartOptions: any;
  lastFiveMonthComplete: number[] = [];
  lastFiveMonthUncomplete: number[] = [];
  customTicks:number[]=[];

  @ViewChild('dt') table!: Table;

  constructor(private taskService: TaskService,private fb: FormBuilder,) {

    this.customTicks=[4, 8, 12, 16, 20, 24, 28, 32];
    this.months = [
      { name: 'January', code: 1 },
      { name: 'February', code: 2 },
      { name: 'March', code: 3 },
      { name: 'April', code: 4 },
      { name: 'May', code: 5 },
      { name: 'June', code: 6 },
      { name: 'July', code: 7 },
      { name: 'August', code: 8 },
      { name: 'September', code: 9 },
      { name: 'October', code: 10 },
      { name: 'November', code: 11 },
      { name: 'December', code: 12 },
    ];

    this.doughnutChartData = {
      labels: ['Completed Task', 'Uncompleted Task', 'Total Tasks'],
      datasets: [
        {
          data: [this.completedCount, this.notCompletedCount, this.totalCount],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    this.barChartData = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [
        {
          label: 'Completed Tasks',
          backgroundColor: '#FF6384',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56],
        },
        {
          label: 'Uncompleted Tasks',
          backgroundColor: '#36A2EB',
          borderColor: '#7CB342',
          data: [28, 48, 40, 19, 86],
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Month',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Task Count',
          },
          scales: {
            y: {
              ticks: {

                stepSize: this.customTicks, // Increment by 2 units
                beginAtZero: true // Start from zero
              }
            }
          }
        },
      },
    };
  }

  ngOnInit(): void {
    this.Roles = [{ name: 'Manager' }, { name: 'Admin' }];
    this.loadPerformanceData();
  }

  onMonthChange(event:any) {
    this.chartdata={
      email:this.currentEmail,
      month:this.selectedMonth.code,
      year:new Date().getFullYear()
     }
    this.taskService.getchartData(this.chartdata).subscribe((data: any) => {
      this.completedCount = data.completedCount;
      this.notCompletedCount = data.notCompletedCount;
      this.totalCount = data.totalCount;
      this.updateDoughnutChart();
  });
    console.log('Selected month:', this.selectedMonth);
}
  updateDoughnutChart() {
    this.doughnutChartData = {
      labels: ['Completed Tasks', 'Uncompleted Tasks', 'Total Tasks'],
      datasets: [
        {
          data: [this.completedCount, this.notCompletedCount, this.totalCount],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
  }
  get f() {
    return this.managerForm.controls;
  }

  onRowSelect(event: any) {
    debugger
    this.selectedEmployee = event.data.empName;
    this.currentEmail=event.data.email;
     this.chartdata={
      email:this.currentEmail,
      month:new Date().getMonth()+1,
      year:new Date().getFullYear()
     }
    this.taskService.getchartData(this.chartdata).subscribe((data: any) => {
      this.completedCount = data.completedCount;
      this.notCompletedCount = data.notCompletedCount;
      this.totalCount = data.totalCount;
      this.selectedMonth = this.months.find((x) => x.code === this.chartdata.month) || this.months[0]
      this.updateDoughnutChart();

      this.taskService
        .getMonthlyEmployeeTaskSummary(event.data.email)
        .subscribe((res: any) => {
          this.lastFiveMonthComplete = [];
          this.lastFiveMonthUncomplete = [];

          // Process each month data
          res.value.forEach((item: any) => {
            this.lastFiveMonthComplete.push(item.completedTaskCount);
            this.lastFiveMonthUncomplete.push(item.uncompletedTaskCount);
          });

          // Update bar chart data
          this.updateBarChartData(res.value);
        });
    });
  }

  updateBarChartData(taskData: any[]) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const fixedIndices = [0, 2, 4, 6, 8, 10, 12, 14];
    const completedTasks = new Array(12).fill(0);
    const uncompletedTasks = new Array(12).fill(0);

    // Populate the arrays with task data
    taskData.forEach((item: any) => {
      const monthIndex = item.month - 1; // Adjust for zero-based index
      completedTasks[monthIndex] = item.completedTaskCount;
      uncompletedTasks[monthIndex] = item.uncompletedTaskCount;
    });

    const currentMonth = new Date().getMonth(); // Get the current month index (0 for January, 11 for December)
    const lastFiveMonths = [];

    // Calculate the last five months' names
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Calculate the correct month index
      lastFiveMonths.unshift(months[monthIndex]); // Add month to the beginning of the array
    }

    // Extract data for the last five months
    const lastFiveCompletedTasks = [];
    const lastFiveUncompletedTasks = [];
    for (let i = 0; i < 5; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      lastFiveCompletedTasks.unshift(completedTasks[monthIndex]);
      lastFiveUncompletedTasks.unshift(uncompletedTasks[monthIndex]);
    }

    // Update the bar chart data
    this.barChartData = {
      labels: lastFiveMonths,
      datasets: [
        {
          label: 'Completed Tasks',
          backgroundColor: '#FF6384',
          borderColor: '#1E88E5',
          data: lastFiveCompletedTasks,
        },
        {
          label: 'Uncompleted Tasks',
          backgroundColor: '#36A2EB',
          borderColor: '#7CB342',
          data: lastFiveUncompletedTasks,
        },
      ],
    };
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

  loadPerformanceData(): void {
    this.taskService.GetAllEmployee().subscribe(
      (data) => {
        this.EmployeeList = data;
        if (this.EmployeeList.length > 0) {
          this.currentEmail = this.EmployeeList[0].email;
          this.chartdata={
            email:this.currentEmail,
            month:new Date().getMonth()+1,
            year:new Date().getFullYear()
           }
          this.taskService
            .getchartData(this.chartdata)
            .subscribe((response: any) => {
              this.completedCount = response.completedCount;
              this.notCompletedCount = response.notCompletedCount;
              this.totalCount = response.totalCount;
              this.currentMonth = response.currentMonth;
              this.selectedMonth =
                this.months.find((x) => x.name === this.currentMonth) ||
                this.months[0];
              this.updateDoughnutChart();
            });

          this.taskService
            .getMonthlyEmployeeTaskSummary(this.currentEmail)
            .subscribe((res: any) => {
              this.lastFiveMonthComplete = [];
              this.lastFiveMonthUncomplete = [];

              // Process each month data
              res.value.forEach((item: any) => {
                this.lastFiveMonthComplete.push(item.completedTaskCount);
                this.lastFiveMonthUncomplete.push(item.uncompletedTaskCount);
              });

              // Update bar chart data
              this.updateBarChartData(res.value);
            });
        }
      },
      (error) => {
        console.error('Error fetching performance data', error);
      }
    );
  }
  showBasicDialog()
  {
    this.displayBasic=true;
  }

  clear(table: Table) {
    table.clear();
  }
}

