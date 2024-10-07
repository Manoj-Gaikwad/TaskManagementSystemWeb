import { NgModule } from "@angular/core";
import { ManagerComponent } from "./manager.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "primeng/api";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";

const route: Routes = [
    { path: '', component: ManagerComponent }
]
@NgModule({
    declarations: [ManagerComponent],
    imports: [
        SharedModule,
        TableModule,
        DropdownModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        ReactiveFormsModule,
        RouterModule.forChild(route)
    ]
})
export class ManagerModule { } 