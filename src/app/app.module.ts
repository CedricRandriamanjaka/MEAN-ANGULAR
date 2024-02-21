import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importer le module HttpClientModule
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { HomeManagerModule } from './manager/home-manager/home-manager.module';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    FooterComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule, // Ajouter HttpClientModule ici
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    HomeManagerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
