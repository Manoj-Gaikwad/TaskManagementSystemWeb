import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../Sevices/task.service';
import { PrimeNGConfig } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Register } from 'src/Models/register';
import { NotifyService } from 'src/Sevices/notify.service';
import { AuthService } from '../../Sevices/auth.service';

interface Role {
  name: string;
}
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],
})
export class ManagerComponent implements OnInit {
  allManagerList: any;
  managerForm!: FormGroup;
  managerData!: Register;
  selectedRole!: Role;
  Roles!: Role[];
  loading: boolean = true;
  displayBasic!: boolean;
  updatedialog!: boolean;
  updateUserInfoForm!: FormGroup;
  updateUserInfo!: Register;
  updateUserEmail!: any;
  conformDelete!: boolean;
  RemoveRecordemail!: string;

  @ViewChild('dt') table!: Table;

  constructor(
    private taskservice: TaskService,
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private authservice: AuthService
  ) {
    //initialize Roles Dropdown
    this.Roles = [
      { name: 'Manager' },
      // { name: 'Admin' }
    ];

    //Add Validation To Manager Form
    this.managerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/
          ),
        ],
      ],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      role: ['', Validators.required],
    });

    //Add Validation To updateUserInfoForm
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
    this.GetAllManagerList();
  }
  //Get All Manager List
  GetAllManagerList() {
    this.taskservice.GetAllManager().subscribe((data) => {
      this.allManagerList = data;
      if (this.allManagerList !== null) {
        this.loading = false;
      }
    });
  }
  //contains Manager Form Controls
  get f() {
    return this.managerForm.controls;
  }
  //open crate dialog
  showBasicDialog() {
    this.displayBasic = true;
  }
  //Submit Create Manager Form
  onSubmit() {
    this.managerData = this.managerForm.value;
    var data = this.managerForm.value;
    var role = data.role.name;
    this.managerData.role = role;
    this.managerData.dob = new Date(this.managerData.dob).toISOString();
    this.authservice.register(this.managerData).subscribe((response: any) => {
      debugger;
      if (response.result == 'User created successfully') {
        this.notifyService.showSuccess();
        this.managerForm.reset();
        this.GetAllManagerList();
        this.displayBasic = false;
      } else {
        this.notifyService.showError();
        this.managerForm.reset();
      }
    });
  }
  //contains updateUserInfoForm Form Controls
  get j() {
    return this.updateUserInfoForm.controls;
  }
  //Open Update Dialog
  showUpdateDialog(data: any) {
    this.updatedialog = true;
    this.updateUserEmail = data;
    this.authservice
      .getLoginUserDetails(this.updateUserEmail)
      .subscribe((data: any) => {
        this.updateUserInfo = data;
        const dob = new Date(this.updateUserInfo.dob)
          .toISOString()
          .split('T')[0];
        if (this.updateUserInfo != null) {
          // this.Roles.name=this.updateProfileData.role;
          this.updateUserInfoForm.patchValue({
            firstName: this.updateUserInfo.firstName,
            lastName: this.updateUserInfo.lastName,
            email: this.updateUserInfo.email,
            dob: dob,
            address: this.updateUserInfo.address,
            department: this.updateUserInfo.department,
            role: this.Roles,
            managerId: this.updateUserInfo.managerId,
            phoneNumber: this.updateUserInfo.phoneNumber,
          });
        } else {
          this.notifyService.showError();
        }
      });
  }
  //Submit Updated Form
  sumbit_updateForm(data: any) {
    this.updateUserInfo = data.value;
    this.updateUserInfo.dob = new Date(data.value.dob).toISOString();
    this.authservice
      .updateUserInfo(this.updateUserInfo)
      .subscribe((data: any) => {
        const response = data;
        if (data != 'null') {
          this.updatedialog = false;
          this.notifyService.showSuccess();
          this.GetAllManagerList();
        } else {
          this.notifyService.showError();
        }
      });
  }

  showconformDeleteDialog(data: any) {
    debugger;
    this.RemoveRecordemail = data;
    this.conformDelete = true;
  }

  deleteRecord() {
    this.conformDelete = false;
    this.taskservice
      .DeleteRecoredManager(this.RemoveRecordemail)
      .subscribe((data) => {
        debugger;
        if (data != null) {
          this.GetAllManagerList();
          this.notifyService.showSuccess();
        } else {
          this.notifyService.showError();
        }
      });
  }
  //Apply Global Filter
  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.table.filterGlobal(inputElement.value, 'contains');
  }

  //Clear global Filter
  clear(table: Table) {
    table.clear();
  }
}
