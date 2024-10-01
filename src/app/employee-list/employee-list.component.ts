import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/Sevices/notify.service';
import { Register } from 'src/Models/register';
import { AuthService } from '../../Sevices/auth.service';
import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';

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
  selectedRole!: Role;
  checkRole!: any;
  updateProfile!: Register;
  updateUserInfoForm!: FormGroup;
  updatedialog!: boolean;
  updateUserEmail: any;
  RemoveRecordemail!:string;
  selectedEmployee!: any[];
  conformDelete!:boolean;
  loading: boolean = true;

  @ViewChild('dt') table!: Table;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private authservice: AuthService,
    private notifyService: NotifyService,
    private primengConfig: PrimeNGConfig
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6),  Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/) ]],
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
    this.GetManagerWiseEmployee();

    this.primengConfig.ripple = true;
  }
  get f() {
    return this.registerForm.controls;
  }
  get j() {
    return this.updateUserInfoForm.controls;
  }

  onSubmit() {
    this.registerData = this.registerForm.value;
    var data = this.registerForm.value;
    var role = data.role.name;
    this.registerData.role = role;
    this.registerData.dob = new Date(this.registerData.dob).toISOString();
    this.authservice.register(this.registerData).subscribe((response: any) => {
      if (response.result == 'User created successfully') {
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

  onActivityChange(event: any) {
    const value = event.target.value;
    if (value && value.trim().length) {
      const activity = parseInt(value);

      if (!isNaN(activity)) {
        this.table.filter(activity, 'activity', 'gte');
      }
    }
  }
  onDateSelect(value: any) {
    this.table.filter(this.formatDate(value), 'date', 'equals');
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.table.filterGlobal(inputElement.value, 'contains');
  }

  clear(table: Table) {
    table.clear();
  }

  onFilter(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.table.filter(inputElement.value, field, 'contains');
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

  onRepresentativeChange(event: any) {
    this.table.filter(event.value, 'representative', 'in');
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
      if (this.getManagerWiseEmpList != null) {
        this.loading = false;
      } else {
        this.loading = true;
      }
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


  showconformDeleteDialog(data:any){
    debugger
    this.RemoveRecordemail=data;
    this.conformDelete=true;
  }
  deleteRecord()
  {
    this.conformDelete=false;
    this.taskService.DeleteRecoredEmployee(this.RemoveRecordemail).subscribe(data=>{
      debugger
      if(data!=null)
      {
         this.GetManagerWiseEmployee();
        this.notifyService.showSuccess();

      }
      else{
        this.notifyService.showError();
      }
    })
  }
}
