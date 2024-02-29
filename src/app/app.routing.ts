import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Importez le service CookieService
import { HomeClient } from './home-utilisateur/home.component';
import { ProfileUtilisateur } from './profile-utilisateur/profile.component';
import { SignupComponent } from './signup/signup.component';
import { detail } from './detail-service/landing.component';
import { HomeEmploye } from './home-employe/landing.component';
import { LoginComponent } from './login/login.component';
import { HomeManagerComponent } from './manager/home-manager/home-manager.component';
import { ServicesComponent } from './manager/services/services.component';
import { EmployesComponent } from './manager/employes/employes.component';
import { HoraireEmployeComponent } from './manager/horaire-employe/horaire-employe.component';
import { DepensesComponent } from './manager/depenses/depenses.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private cookieService: CookieService) { }

  isLoggedIn(): boolean {
    const userId = this.cookieService.get('userId'); // Récupérez l'identifiant d'utilisateur depuis les cookies
    return !!userId; // Vérifiez si l'identifiant d'utilisateur est défini
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['home-client']); // Redirigez l'utilisateur vers la page home-client s'il n'est pas connecté
      return false;
    }
    return true;
  }
}

const routes: Routes = [
  { path: 'home-client', component: HomeClient },
  { path: 'home-employe', component: HomeEmploye, canActivate: [AuthGuard]  },
  { path: 'user-profile', component: ProfileUtilisateur, canActivate: [AuthGuard] }, // Restreignez l'accès au profile utilisateur
  { path: 'register', component: SignupComponent },
  { path: 'detail/:id', component: detail, canActivate: [AuthGuard] }, // Restreignez l'accès au détail
  { path: 'login', component: LoginComponent },
  { path: 'manager', component: HomeManagerComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'employes', component: EmployesComponent },
  { path: 'depenses', component: DepensesComponent },
  { path: 'horaire/:employeId', component: HoraireEmployeComponent },
  { path: '', redirectTo: 'home-client', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    }),
  ],
  exports: [
  ],
  providers: [AuthService] // Ajoutez AuthService aux providers
})
export class AppRoutingModule { }
