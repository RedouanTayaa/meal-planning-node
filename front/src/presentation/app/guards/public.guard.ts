import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicGuard implements CanActivateChild {
  constructor(
    private router: Router
  ) {}

  canActivateChild(): Observable<boolean> {
    if (true) { // get token
      this.router.navigate([`/`]);
      return of(false);
    }
    return of(true);
  }
}
