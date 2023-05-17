import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router
  ) {}

  canActivateChild(): boolean {
    if (true) return true; // get token
    this.router.navigate([`/login`]);
    return false;
  }
}
