import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '../Sevices/AuthGuard ';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { rootNavigationRoutes } from './common/rootNavigationRoutes';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: rootNavigationRoutes.tasks,
    loadChildren: () => import('./task-list/task-list.module').then(m => m.TaskListModule),
    canActivate: [AuthGuard]
  },
  { path: rootNavigationRoutes.employees, component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: rootNavigationRoutes.admin, component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: rootNavigationRoutes.manager,
    loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
    canActivate: [AuthGuard]
  },
  { path: rootNavigationRoutes.login, component: LoginComponent },
  { path: rootNavigationRoutes.register, component: RegisterComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
