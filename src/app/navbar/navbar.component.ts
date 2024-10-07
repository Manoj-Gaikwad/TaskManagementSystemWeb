import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Sevices/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Register } from 'src/Models/register';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/Sevices/notify.service';
import { UpdatePasswordModel } from 'src/Models/UpdatePasswordModel';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { rootNavigationRoutes } from '../common/rootNavigationRoutes';
interface Role {
  name: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  rootNavigationRoutes = rootNavigationRoutes;
  isAuthenticated$!: Observable<boolean>;
  userRoles$!: Observable<string>;
  items!: any;
  userinfo!: any;
  displayBasic!: boolean;
  updateProfile!: Register;
  updateProfileForm!: FormGroup;
  selectedCity!: Role;
  Roles!: Role[];
  updateProfileData: any;
  displayUpdatePassword!: boolean;
  currentPassword!: string;
  newPassword!: string;
  UpdatePassModel!: UpdatePasswordModel;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private router: Router, private location: Location
  ) {
    this.updateProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //brouser back button logic
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/login') {
          console.log('Navigated to login page.');
          this.authService.userInfo.next(null);
          this.authService.isAuthenticatedSubject.next(false);
        }
      });

    this.authService.userInfo.subscribe((data: any) => {
      this.userinfo = data;
    });
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.userRoles$ = this.authService.isAuthenticated$.pipe(
      map((isAuth) => (isAuth ? this.authService.getUserRoles() : ''))
    );

    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user-edit',
        command: () => {
          this.Profile();
        },
      },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
      {
        label: 'Update Password',
        icon: 'pi pi-key',
        command: () => {
          this.UpdatePassword();
        },
      },
    ];
  }

  UpdatePassword() {
    this.displayUpdatePassword = true;
    this.currentPassword = '';
    this.newPassword = '';
  }

  modifyPassword() {
    this.UpdatePassModel = new UpdatePasswordModel();
    this.UpdatePassModel = {
      CurrentPassword: this.currentPassword,
      NewPassword: this.newPassword,
      Email: this.userinfo.email,
    };
    if (
      this.UpdatePassModel.CurrentPassword != null &&
      this.UpdatePassModel.NewPassword != null &&
      this.UpdatePassModel.Email != null
    ) {
      this.authService
        .modifyPassword(this.UpdatePassModel)
        .subscribe((response: any) => {
          if (response.message == 'Password updated successfully') {
            this.currentPassword = '';
            this.newPassword = '';
            this.displayUpdatePassword = false;
            this.notifyService.showSuccess();
          } else {
            this.notifyService.showError();
          }
        });
    }
  }
  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  onSubmit(data: any) {
    debugger
    this.updateProfileData = data.value;
    this.updateProfileData.dob = new Date(data.value.dob).toISOString();
    this.authService
      .updateUserInfo(this.updateProfileData)
      .subscribe((data: any) => {
        const response = data;
        if (data != 'null') {
          this.userinfo = data[0];
          this.displayBasic = false;
          this.notifyService.showSuccess();
        } else {
          this.notifyService.showError();
        }
      });
  }

  hasRole(userRoles: string, role: string): boolean {
    return userRoles === role;
  }

  Profile() {
    this.displayBasic = true;
    this.authService
      .getLoginUserDetails(this.userinfo.email)
      .subscribe((data: any) => {
        this.updateProfileData = data;
        const dob = new Date(this.updateProfileData.dob)
          .toISOString()
          .split('T')[0];
        if (this.updateProfileData != null) {
          // this.Roles.name=this.updateProfileData.role;
          this.updateProfileForm.patchValue({
            firstName: this.updateProfileData.firstName,
            lastName: this.updateProfileData.lastName,
            email: this.updateProfileData.email,
            dob: dob,
            address: this.updateProfileData.address,
            department: this.updateProfileData.department,
            role: this.Roles,
            managerId: this.updateProfileData.managerId,
            phoneNumber: this.updateProfileData.phoneNumber,
          });
        } else {
          this.notifyService.showError();
        }
      });
  }

  get f() {
    return this.updateProfileForm.controls;
  }
}
