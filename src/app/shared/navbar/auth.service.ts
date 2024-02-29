import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.updateLoggedInStatus();
  }

  public updateLoggedInStatus(): void {
    const userEmail = this.cookieService.get('userEmail');
    this.isLoggedInSubject.next(!!userEmail);
  }

  public logout(): void {
    this.cookieService.deleteAll();
    this.cookieService.set('userRole','100');
    this.updateLoggedInStatus();
  }
}
