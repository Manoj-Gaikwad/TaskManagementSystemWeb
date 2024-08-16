import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/Sevices/notify.service';
import { Register } from 'src/Models/register';
import { AuthService } from '../../Sevices/auth.service';

interface Role {
  name: string;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  allEmployeeList: any;
  getManagerWiseEmpList: any;
  displayBasic!: boolean;
  registerForm!: FormGroup;
  registerData!: Register;
  managerEmail!: any;
  ManagerId!: any;
  Roles!: Role[];
  selectedCity!: Role;
  checkRole!: any;
  updateProfile!: Register;
  updateUserInfoForm!: FormGroup;
  updatedialog!: boolean;
  updateUserEmail: any;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private authservice: AuthService,
    private notifyService: NotifyService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
      managerId: ['', Validators.required],
    });

    this.updateUserInfoForm = this.fb.group({
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
    // this.getAllEmployeeList();
    this.GetManagerWiseEmployee();
  }
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.registerData = this.registerForm.value;
    var data = this.registerForm.value;
    var role = data.role.name;
    this.registerData.role = role;
    this.registerData.dob = new Date(this.registerData.dob).toISOString();
    this.authservice.register(this.registerData).subscribe((response: any) => {
      if (response != null || '') {
        this.notifyService.showSuccess();
        this.registerForm.reset();
        this.GetManagerWiseEmployee();
        this.displayBasic = false;
      } else {
        this.notifyService.showError();
        this.registerForm.reset();
      }
    });
  }

  showBasicDialog() {
    this.displayBasic = true;
  }
  getAllEmployeeList() {
    this.taskService.getAllEmployeeList().subscribe((data: any) => {
      this.allEmployeeList = data;
    });
  }
  GetManagerWiseEmployee() {
    this.taskService.GetManagerWiseEmployee().subscribe((data: any) => {
      this.getManagerWiseEmpList = data.data;
      this.managerEmail = data.manager.email;
      this.ManagerId = data.manager.id;
      this.checkRole = data.manager.role;
      if (this.checkRole != null && this.checkRole == 'Manager') {
        this.Roles = [{ name: 'Employee' }];
      } else {
        this.Roles = [{ name: 'Manager' }, { name: 'Admin' }];
      }
      this.registerForm.patchValue({
        managerId: this.ManagerId,
      });
    });
  }

  showUpdateDialog(data: any) {
    this.updatedialog = true;
    this.updateUserEmail = data;
    this.authservice
      .getLoginUserDetails(this.updateUserEmail)
      .subscribe((data: any) => {
        this.updateProfile = data;
        const dob = new Date(this.updateProfile.dob)
          .toISOString()
          .split('T')[0];
        if (this.updateProfile != null) {
          // this.Roles.name=this.updateProfileData.role;
          this.updateUserInfoForm.patchValue({
            firstName: this.updateProfile.firstName,
            lastName: this.updateProfile.lastName,
            email: this.updateProfile.email,
            dob: dob,
            address: this.updateProfile.address,
            department: this.updateProfile.department,
            role: this.Roles,
            managerId: this.updateProfile.managerId,
            phoneNumber: this.updateProfile.phoneNumber,
          });
        } else {
          this.notifyService.showError();
        }
      });
  }
  updateFormSumbit(data: any) {
    this.updateProfile = data.value;
    this.updateProfile.dob = new Date(data.value.dob).toISOString();
    this.authservice
      .updateUserInfo(this.updateProfile)
      .subscribe((data: any) => {
        const response = data;
        if (data != 'null') {
          this.updatedialog = false;
          this.notifyService.showSuccess();
          this.GetManagerWiseEmployee();
        } else {
          this.notifyService.showError();
        }
      });
  }
}
