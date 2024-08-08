import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:44306/api'; // Base URL for your API
  user!: any;
  userRole!: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      this.userRole = this.user.roles;
    } else {
      console.error('No user data found in localStorage');
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  GetManagerAssignTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Task/GetAllTasks`, { headers: this.getHeaders() });
  }
  createTask(task: any){
    return this.http.post(`${this.apiUrl}/Task/CreateTask`, task , { headers: this.getHeaders() });
  }

  uploadDocument(taskId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());

    return this.http.post(`${this.apiUrl}/tasks/upload`, formData, { headers: this.getHeaders() });
  }

  getMonthWisePerformance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Admin/MonthWisePerformance`, { headers: this.getHeaders() });
  }

  getAllEmployeeList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Employee/GetAllEmployeeList`, { headers: this.getHeaders() });
  }

  GetManagerWiseEmployee(): Observable<any>{
    return this.http.get(`${this.apiUrl}/Employee/GetManagerWiseEmployee`, { headers: this.getHeaders() })
  }

  GetAssignTasks(): Observable<any> {
    if (this.userRole === "Employee") {
      return this.http.get(`${this.apiUrl}/Employee/GetAllTasks`, { headers: this.getHeaders() });
    } else {
      return this.http.get(`${this.apiUrl}/Task/GetAllTasks`, { headers: this.getHeaders() });
    }
  }

  GetAllManagedEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Task/GetAllManagedEmployees`, { headers: this.getHeaders() });
  }


}
