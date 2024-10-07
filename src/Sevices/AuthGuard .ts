import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {debugger
      console.log('isAuthenticated()',this.authService.isAuthenticated());
      
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      localStorage.clear();
      this.router.navigate(['login']);
      return false;
    }
  }
}
