import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { TaskService } from 'src/Sevices/task.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SharedModule } from '../common/shared.module';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['GetManagerWiseEmployee']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      imports: [SharedModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: TaskService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    // initialize form
    component.registerForm = TestBed.inject(FormBuilder).group({
      managerId: ['']
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 👇 simple test case for GetManagerWiseEmployee
  it('should load employees when GetManagerWiseEmployee is called', () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Emp1' }],
      manager: { email: 'manager@test.com', id: 101, role: 'Manager' }
    };

    // make spy return mockResponse when called
    taskServiceSpy.GetManagerWiseEmployee.and.returnValue(of(mockResponse));

    // call the function
    component.GetManagerWiseEmployee();

    // check values updated
    expect(component.getManagerWiseEmpList).toEqual(mockResponse.data);
    expect(component.managerEmail).toBe('manager@test.com');
    expect(component.ManagerId).toBe(101);
  });
});
