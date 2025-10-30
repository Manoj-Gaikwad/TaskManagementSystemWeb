import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/Sevices/auth.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService={
     login: jasmine.createSpy('login').and.returnValue(of({ result: 'Successfully Login' })),
      UserRole: new BehaviorSubject<any>(null)
  }
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,ReactiveFormsModule],
      declarations: [ LoginComponent ],
      providers:[
        {provide:AuthService,useValue:mockAuthService},
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login call',()=>{
      component.loginForm.setValue({
        email:'manoj.gaikwad@fusionstak.com',
        password:'Manoj@123'
      })
      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalled();
    
  });
});
