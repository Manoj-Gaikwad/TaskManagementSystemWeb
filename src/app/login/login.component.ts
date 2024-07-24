import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/Sevices/auth.service';
import { NotifyService } from 'src/Sevices/notify.service';
import { login } from 'src/Models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  LoginData!: login;
  responseData: any;

  constructor(private fb: FormBuilder, private authservice: AuthService, private notifyservice: NotifyService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    // Optional: You can perform additional initialization logic here if needed
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.LoginData = this.loginForm.value;

      this.authservice.login(this.LoginData).subscribe(data => {
        this.responseData = data;
        if (this.responseData.token) {
          this.notifyservice.showSuccess();
        } else {
          this.notifyservice.showError();
        }
      }, error => {
        this.notifyservice.showError();
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
