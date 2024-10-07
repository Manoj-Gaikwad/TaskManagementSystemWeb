import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TaskListComponent } from './task-list/task-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AdminComponent } from './admin/admin.component';
import { ManagerComponent } from './manager/manager.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

import { AuthService } from '../Sevices/auth.service';
import { TaskService } from '../Sevices/task.service';
import { NotifyService } from 'src/Sevices/notify.service';
import { SharedModule } from './common/shared.module';

// Import SharedModule

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // TaskListComponent,
    NavbarComponent,
    EmployeeListComponent,
    AdminComponent,
    // ManagerComponent,
    HomeComponent,
    RegisterComponent,
    // Other components
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule, // Include SharedModule here
    AppRoutingModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: ['localhost:5001'],
    //     disallowedRoutes: ['http://localhost:5001/api/auth']
    //   }
    // })
  ],
  providers: [
    AuthService,
    TaskService,
    NotifyService,
    MessageService // Provide PrimeNG MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
