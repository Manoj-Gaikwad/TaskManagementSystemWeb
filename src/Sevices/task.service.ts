import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Upload } from 'src/Models/upload';
import { Customer } from 'src/Models/customer';
import { chartData } from 'src/Models/chartData';

@Injectable({
  providedIn: 'root',
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
      'Content-Type': 'application/json',
    });
  }

  GetManagerAssignTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Task/GetAllTasks`, {
      headers: this.getHeaders(),
    });
  }

  createTask(task: any) {
    return this.http.post(`${this.apiUrl}/Task/CreateTask`, task, {
      headers: this.getHeaders(),
    });
  }

  updateTask(task: any): Observable<any> {
    const headers = this.getHeaders().append('Accept', 'text/plain'); // Append additional headers if needed

    return this.http.post(`${this.apiUrl}/Task/UpdateTask`, task, {
      headers: headers,
      responseType: 'text' as 'json', // Ensure responseType is text
    });
  }

  uploadDocument(upload: any): Observable<any> {
    const formData = new FormData();
    formData.append('File', upload.File);
    formData.append('TaskId', upload.TaskId.toString());
    formData.append('isComplited', upload.isComplited.toString());
    formData.append('FileUpload', upload.FileUpload);
    return this.http.post<string>(
      `${this.apiUrl}/Employee/UploadFile`,
      formData,
      {
        headers: new HttpHeaders({
          Accept: 'text/plain',
        }),
        responseType: 'text' as 'json', // Ensure responseType is text
      }
    );
  }

  getMonthWisePerformance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Admin/MonthWisePerformance`, {
      headers: this.getHeaders(),
    });
  }

  getAllEmployeeList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Employee/GetAllEmployeeList`, {
      headers: this.getHeaders(),
    });
  }

  GetManagerWiseEmployee(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Employee/GetManagerWiseEmployee`, {
      headers: this.getHeaders(),
    });
  }

  GetAssignTasks(): Observable<any> {
    if (this.userRole === 'Employee') {
      return this.http.get(`${this.apiUrl}/Employee/GetAllTasks`, {
        headers: this.getHeaders(),
      });
    } else {
      return this.http.get(`${this.apiUrl}/Task/GetAllTasks`, {
        headers: this.getHeaders(),
      });
    }
  }

  GetAllManagedEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Task/GetAllManagedEmployees`, {
      headers: this.getHeaders(),
    });
  }

  GetTaskById(data: any) {
    return this.http.get(`${this.apiUrl}/Task/GetTaskById?TaskId=${data}`);
  }

  getCustomersLarge() {
    return this.http
      .get<any>('assets/customers-large.json')
      .toPromise()
      .then((res) => <Customer[]>res.data)
      .then((data) => {
        return data;
      });
  }

  getchartData(chartdata: chartData) {
    debugger;
    return this.http.post(`${this.apiUrl}/Admin/GetChartData`, chartdata, {
      headers: this.getHeaders(),
    });
  }

  GetAllEmployee() {
    return this.http.get(`${this.apiUrl}/Admin/GetAllEmployee`, {
      headers: this.getHeaders(),
    });
  }

  getMonthlyEmployeeTaskSummary(email: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Admin/GetMonthlyEmployeeTaskSummary?email=${email}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  GetAllManager() {
    return this.http.get(`${this.apiUrl}/Admin/GetAllManager`, {
      headers: this.getHeaders(),
    });
  }

  DeleteRecoredManager(email: string) {
    return this.http.delete(
      `${this.apiUrl}/Admin/DeleteRecoredManager?email=${email}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  DeleteRecoredEmployee(email: string) {
    return this.http.delete(
      `${this.apiUrl}/Employee/DeleteRecordEmployee?email=${email}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
