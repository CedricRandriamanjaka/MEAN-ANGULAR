import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { detail } from './detail-service/landing.component'; // Correction ici
import { ProfileUtilisateur } from './profile-utilisateur/profile.component'; // Correction ici
import { HomeEmploye } from './home-employe/landing.component'; // Correction ici
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LoginComponent } from './login/login.component';
import { HomeModuleClient } from './home-utilisateur/home.module';
import { HomeManagerModule } from './manager/home-manager/home-manager.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    detail, // Correction ici
    ProfileUtilisateur, // Correction ici
    HomeEmploye, // Correction ici
    NavbarComponent,
    FooterComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModuleClient,
    FullCalendarModule,
    BrowserAnimationsModule,
  ],
  providers: [
    DatePipe,
    HomeManagerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
