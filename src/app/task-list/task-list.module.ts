import { NgModule } from "@angular/core";
import { TaskListComponent } from "./task-list.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../common/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";

const route: Routes = [
    { path: '', component: TaskListComponent }
]

@NgModule({
    declarations: [TaskListComponent],
    imports: [
        SharedModule,
        ReactiveFormsModule,
        TableModule,
        RouterModule.forChild(route)
    ]
})
export class TaskListModule { }