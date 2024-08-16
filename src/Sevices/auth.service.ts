import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { login } from '../Models/login';
import { Register } from 'src/Models/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:44306/api/Auth';
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isTokenValid()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public UserRole = new BehaviorSubject<string>('');
  public userInfo = new BehaviorSubject<any>(this.getUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(register: Register) {
    return this.http.post(this.apiUrl + '/register', register);
  }

  login(loginData: login): Observable<any> {
    return this.http.post(this.apiUrl + '/login', loginData).pipe(
      map((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem(
            'user',
            JSON.stringify({
              firstName: response.firstName,
              lastName: response.lastName,
              phoneNumber: response.phoneNumber,
              email: response.email,
              roles: response.roles, // Assuming roles is now a single string like 'Admin' or 'Manager'
            })
          );
          this.isAuthenticatedSubject.next(true);
          this.userInfo.next(response);
          this.router.navigate(['/home']);
        }
        return response;
      }),
      catchError((error: any) => {
        // Handle login errors if needed
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token || '');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getUserRoles(): string {
    const user = this.getUser();
    return user.roles || '';
  }
  private isTokenValid(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  getLoginUserDetails(email: any) {
    return this.http.get(`${this.apiUrl}/GetLoginUserDetails?email=${email}`);
  }

  updateUserInfo(data: any) {
    return this.http.post(`${this.apiUrl}/UpdateUserInfo`, data, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
      responseType: 'json', // Ensure responseType is text
    });
  }
}
