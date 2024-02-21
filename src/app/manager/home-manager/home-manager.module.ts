import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { HomeManagerComponent } from './home-manager.component';

import { SectionsModule } from '../../sections/sections.module';
import { NavbarManagerComponent } from '../navbar-manager/navbar-manager.component';
import { ServicesComponent } from '../services/services.component';
import { EmployesComponent } from '../employes/employes.component';
import { HoraireEmployeComponent } from '../horaire-employe/horaire-employe.component';
import { DepensesComponent } from '../depenses/depenses.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        SectionsModule, NgbModule
    ],
    declarations: [ 
        HomeManagerComponent, 
        NavbarManagerComponent,
        ServicesComponent,
        EmployesComponent,
        HoraireEmployeComponent,
        DepensesComponent
    ],
    exports:[ HomeManagerComponent ],
    providers: []
})
export class HomeManagerModule { }
