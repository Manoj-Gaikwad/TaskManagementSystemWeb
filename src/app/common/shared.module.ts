import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { PasswordModule } from 'primeng/password';
import { ChartModule } from 'primeng/chart';
import { PaginatorModule } from 'primeng/paginator';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  imports: [
    CommonModule,
    // Import all PrimeNG modules here
    TableModule,
    ButtonModule,
    ToastModule,
    AvatarModule,
    SplitButtonModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    RadioButtonModule,
    MultiSelectModule,
    ContextMenuModule,
    InputTextModule,
    ProgressBarModule,
    CalendarModule,
    SliderModule,
    PasswordModule,
    ChartModule,
    PaginatorModule,
    MessagesModule,
    MessageModule,
  ],
  exports: [
    // Export all PrimeNG modules for use in other modules
    TableModule,
    ButtonModule,
    ToastModule,
    AvatarModule,
    SplitButtonModule,
    ChipModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    RadioButtonModule,
    MultiSelectModule,
    ContextMenuModule,
    InputTextModule,
    ProgressBarModule,
    CalendarModule,
    SliderModule,
    PasswordModule,
    ChartModule,
    PaginatorModule,
    MessagesModule,
    MessageModule,
    DatePipe
  ]
})
export class SharedModule {}
