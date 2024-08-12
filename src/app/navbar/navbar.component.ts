import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Sevices/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Register } from 'src/Models/register';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Role {
  name: string
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  userRoles$!: Observable<string>;
  items!:any;
  userinfo!:any;
  displayBasic!: boolean;
  updateProfile!: Register;
  updateProfileForm!: FormGroup;
  selectedCity!:Role;
  Roles!:Role[];

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.updateProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      managerId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.userInfo.subscribe((data:any)=>{
      this.userinfo=data;
    });
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userRoles$ = this.authService.isAuthenticated$.pipe(
      map(isAuth => isAuth ? this.authService.getUserRoles() : '')
    );

    this.items = [
      {label: 'Profile', icon: 'pi pi-user', command: () => {
          this.Profile();
      }},
      {label: 'logout', icon: 'pi pi-times', command: () => {
          this.logout();
      }},
      // {label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io'},
      // {separator:true},
      // {label: 'Setup', icon: 'pi pi-cog', routerLink: ['/setup']}
  ];
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
  onSubmit() {
  }

  hasRole(userRoles: string, role: string): boolean {
    return userRoles === role;
  }

Profile() {
  this.displayBasic = true;
}
get f() {
  return this.updateProfileForm.controls;
}
showBasicDialog() {
  this.displayBasic = true;
}
}
