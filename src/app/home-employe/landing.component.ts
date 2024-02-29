import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class HomeEmploye implements OnInit {
  public rdvPREV: any[] = [];
  public rdvLASA: any[] = [];
  public rdvAujourdhui: any[] = [];
  public dateActuelle: Date = new Date();

  public commissionJ: number = 0;
  public commissionP: number = 0;
  public commissionT: number = 0;

  constructor(private datePipe: DatePipe, private http: HttpClient, private cookieService: CookieService) { }
  // readonly ApiUrl = "http://localhost:3000/api/";
  readonly ApiUrl = "https://mean-m1-1-vten.onrender.com/api/";

  getRdvPREV(): void {
    const userId = this.cookieService.get('userId');
    this.http.get<any>(this.ApiUrl + 'rendezVous/employe/' + userId, {})
      .subscribe(response => {
          this.rdvPREV = response.filter(rdv => new Date(rdv.date) > this.dateActuelle);
          this.calculerCommissionP();
      },
      error => {
          console.error('Erreur lors de la récupération de l historique:', error);
      }
    );
  }

  getRdvLASA(): void {
    const userId = this.cookieService.get('userId');
    this.http.get<any>(this.ApiUrl + 'rendezVous/employe/' + userId, {})
      .subscribe(response => {
          this.rdvLASA = response.filter(rdv => new Date(rdv.date) < this.dateActuelle);
          this.calculerCommissionT();
      },
      error => {
          console.error('Erreur lors de la récupération de l historique:', error);
      }
    );
  }

  listRdvAujourdhui(): void {
    const dateAujourdhui = new Date();
    this.rdvAujourdhui = this.rdvPREV.filter(rdv => {
      const dateRdv = new Date(rdv.date);
      return dateRdv.toDateString() === dateAujourdhui.toDateString();
    });
    this.calculerCommissionJ();
  }

  calculerCommissionP(): void {
    for (let rdv of this.rdvPREV) {
      if (rdv.etat === true)
      this.commissionP += rdv.serviceId.prix * rdv.serviceId.commission / 100;
    }
  }

  calculerCommissionT(): void {
    for (let rdv of this.rdvLASA) {
      if (rdv.etat === true)
      this.commissionT += rdv.serviceId.prix * rdv.serviceId.commission / 100;
    }
  }

  calculerCommissionJ(): void {
    for (let rdv of this.rdvAujourdhui) {
      if (rdv.etat === true)
      this.commissionJ += rdv.serviceId.prix * rdv.serviceId.commission / 100;
    }
  }

  formatHistorDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
  }

  toDate(dateStr): Date {
    return new Date(dateStr);
  }

  ngOnInit(): void {
    this.getRdvPREV();
    this.getRdvLASA();
    this.listRdvAujourdhui();
  }
}
