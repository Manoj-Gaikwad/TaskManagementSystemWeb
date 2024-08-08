import { Register } from './../../Models/register';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Sevices/auth.service';
import { NotifyService } from 'src/Sevices/notify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerData!: Register;
  response: any;

  constructor(private fb: FormBuilder, private authservice: AuthService, private notifyService:NotifyService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      department: ['', Validators.required],
      role: ['Employee', Validators.required],
      managerId: ['0', Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.registerData = this.registerForm.value;
    this.registerData.dob = new Date(this.registerData.dob).toISOString();
    this.authservice.register(this.registerData).subscribe((response:any) => {
      if(response!=null||''){
        this.notifyService.showSuccess();
        this.registerForm.reset();
      }
      else
      {
        this.notifyService.showError();
        this.registerForm.reset();
      }
    });
  }
}
