import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:44306/api'; // Base URL for your API

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }

  createTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, task, { headers: this.getHeaders() });
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
    debugger
   return this.http.get(`${this.apiUrl}/Employee/GetAllEmployeeList`, { headers: this.getHeaders() });
  }


 }

