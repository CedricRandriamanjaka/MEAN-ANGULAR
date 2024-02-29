import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { Date } from 'core-js'; // ou import 'core-js/features/date';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  public dateActuelle: Date = new Date();
  toDate(dateStr: string): Date {
    return new Date(dateStr);
  }
  


  public isCollapsed = true;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  public userEmail;
  public isLoggedIn = false;

  public role = this.cookieService.get('userRole');

  public histo;
  // readonly ApiUrl = "http://localhost:3000/api/";
  readonly ApiUrl = "https://mean-m1-1-vten.onrender.com/api/";

  constructor(public location: Location, private router: Router, private http: HttpClient,private cookieService: CookieService,private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else
          window.scrollTo(0, 0);
      }
    });
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.authService.updateLoggedInStatus();
    this.role = this.cookieService.get('userRole');

  }

  isHome() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee === '#/home') {
      return true;
    } else {
      return false;
    }
  }

  isDocumentation() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === '#/documentation') {
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  chargeHisto() {
    const userId = this.cookieService.get('userId');
    this.http.get<any>(this.ApiUrl + 'rendezVous/' + userId, {})
    .subscribe(
        response => {
            this.histo = response;
        },
        error => {
            console.error('Erreur lors de la récupération de l historique:', error);
        }
    );
  }

  annuler(rdvid: any) {
    this.http.post<any>(this.ApiUrl + 'rendezVous/annuler/' + rdvid, {})
    .subscribe(
        response => {
            // this.histo = response;
            console.log('annule');
            this.chargeHisto();
        },
        error => {
            console.error('Erreur lors de l annulation:', error);
        }
    );
    }

}
