import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAlert } from '../sections/alerts-section/alerts-section.component'; // Importez l'interface IAlert
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../shared/navbar/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  email: string;
  motdepasse: string;
  constructor(private route: ActivatedRoute,private cookieService: CookieService,private http: HttpClient, private router: Router,private authService: AuthService) { }

  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const successInscription = params['successInscription'];
      if (successInscription) {
        this.alerts.unshift({
          id: 0,
          type: 'success',
          strong: 'Success! ',
          message: successInscription,
          icon: 'ni ni-like-2'
        });
      }
    });
  }

  login() {
    const user = {
      email: this.email,
      motdepasse: this.motdepasse
    }
    this.http.post<any>('http://localhost:3000/api/utilisateur/connection', user)
      .subscribe(
        response => {
          
          if (!response.messageErreur) {
            
            if (response.role === 1) {
              this.router.navigate(['/home-client']);
            }
            else if (response.role === 2) {
              this.router.navigate(['/home-employe']);
            }
            else if (response.role === 3) {
              this.router.navigate(['/home']);
            } else {
              this.alerts.unshift({
                id: 0,
                type: 'danger',
                strong: 'Error!',
                message: 'role inconnue.',
                icon: 'ni ni-support-16'
              });
            }
          } else {
            this.alerts.unshift({
              id: 0,
              type: response.type,
              strong: response.type + '! ',
              message: response.messageErreur,
              icon: 'ni ni-support-16'
            });
          }
          this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
          console.log(response);
          this.cookieService.set('userEmail', response.email);
          this.cookieService.set('userId', response._id);
          this.cookieService.set('userRole', response.role);
    this.authService.updateLoggedInStatus();

        },
        error => {
          // Si la création de compte échoue, affichez un message d'erreur
          this.alerts.unshift({
            id: 0,
            type: 'danger',
            strong: 'Error!',
            message: 'une erreur est survenue lors de la connection.',
            icon: 'ni ni-support-16'
          });
          console.error(error);
        }
      );
  }
  // Fonction pour fermer une alerte
  close(alert: IAlert) {
    this.alerts.splice(this.alerts.indexOf(alert), 0);
  }
}
