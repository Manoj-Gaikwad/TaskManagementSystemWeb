import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Sevices/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  userRoles$!: Observable<string>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userRoles$ = this.authService.isAuthenticated$.pipe(
      map(isAuth => isAuth ? this.authService.getUserRoles() : '')
    );
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  hasRole(userRoles: string, role: string): boolean {
    return userRoles === role;
  }
}
