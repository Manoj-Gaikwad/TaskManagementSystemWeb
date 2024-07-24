import { Register } from './../../Models/register';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Sevices/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerData!: Register;
  response: any;

  constructor(private fb: FormBuilder, private authservice: AuthService) {}

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
    console.log(this.registerForm.value);
    this.registerData = this.registerForm.value;
    this.registerData.dob = new Date(this.registerData.dob).toISOString();
    console.log(this.registerData);
    this.authservice.register(this.registerData).subscribe((data:any) => {
      this.response = data;
      this.registerForm.reset();
      console.log(this.response);
    });
  }
}
