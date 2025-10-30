import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerComponent } from './manager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // 👈 ADD THIS LINE
import { TaskService } from 'src/Sevices/task.service';
import { AuthService } from 'src/Sevices/auth.service';
import { NotifyService } from 'src/Sevices/notify.service';

describe('ManagerComponent', () => {
  let component: ManagerComponent;
  let fixture: ComponentFixture<ManagerComponent>;

  const mockManagerList = [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
  ];

  const mockTaskService = {
    GetAllManager: jasmine.createSpy('GetAllManager').and.returnValue(of(mockManagerList))
  };

  const mockAuthService = {
    register: jasmine.createSpy('register').and.returnValue(of({ result: 'User created successfully' }))
  };

  const mockNotifyService = {
    showSuccess: jasmine.createSpy('showSuccess'),
    showError: jasmine.createSpy('showError')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, DropdownModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotifyService, useValue: mockNotifyService },
        MessageService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ManagerComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and show success on valid form submit', () => {
    component.managerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Abcd@123',
      phoneNumber: '9876543210',
      dob: '1995-05-05',
      address: 'Some Street',
      department: 'IT',
      role: { name: 'Admin' }
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(mockNotifyService.showSuccess).toHaveBeenCalledWith('User created successfully');
  });

  it('should load all managers and set loading to false', () => {
    component.GetAllManagerList();

    expect(mockTaskService.GetAllManager).toHaveBeenCalled();
    expect(component.allManagerList).toEqual(mockManagerList);
    expect(component.loading).toBeFalse();
  });
});
