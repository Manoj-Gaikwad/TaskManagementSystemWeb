import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { JwtModule } from '@auth0/angular-jwt';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { MessageService } from 'primeng/api'; // Import PrimeNG MessageService

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
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import {AvatarModule} from 'primeng/avatar';
import {SplitButtonModule} from 'primeng/splitbutton';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {FileUploadModule} from 'primeng/fileupload';
import {RadioButtonModule} from 'primeng/radiobutton';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TaskListComponent,
    NavbarComponent,
    EmployeeListComponent,
    AdminComponent,
    ManagerComponent,
    HomeComponent,
    RegisterComponent,
    // Other components
  ],
  imports: [
    TableModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    AppRoutingModule,
    MessagesModule,
    MessageModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    AvatarModule,
    SplitButtonModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    HttpClientModule,
    RadioButtonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5001'],
        disallowedRoutes: ['http://localhost:5001/api/auth']
      }
    })
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
