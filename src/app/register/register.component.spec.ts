import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from 'src/Sevices/auth.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService={
    register:jasmine.createSpy('register').and.returnValue(of({result:'User created successfully'}))
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,ReactiveFormsModule],
      declarations: [ RegisterComponent ],
      providers:[
        {provide:AuthService,useValue:mockAuthService},
         MessageService
      ]
     
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Register Employee',()=>{
    
    component.registerForm.setValue({
      firstName:'Manoj', 
      lastName: 'Gaikwad',
      email: 'manoj.gaikwad@fusionstak.com',
      password: 'Manoj@123',
      phoneNumber: '8408054109',
      dob: new Date('1998-06-29'),
      address: 'Latur',
      department:'IT',
      role: 'Employee',
      managerId:0
    })

    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalled();
  })
});
