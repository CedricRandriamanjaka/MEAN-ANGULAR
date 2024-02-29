import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeClient implements OnInit {
  services: any = [];
  serviceSpecial: any = [];
  competences: any = [];
  serviceCompetence: any = [];
  
    constructor(private http: HttpClient, private cookieService: CookieService) { }

    // readonly ApiUrl = "http://localhost:3000/api/";
    readonly ApiUrl = "https://mean-m1-1-vten.onrender.com/api/";

      getServices() {
        this.http.get(this.ApiUrl + 'services/nonSpecial')
          .subscribe(
            (data) => {
              this.services = data;
            },
            (error) => {
              console.error('Error:', error);
            }
          );
      }

      getServiceSpecial() {
        this.http.get(this.ApiUrl + 'services/serviceSpecial')
          .subscribe(
            (data) => {
              this.serviceSpecial = data;
            },
            (error) => {
              console.error('Error:', error);
            }
          );
      }

      getServiceCompetence() {
        const userId = this.cookieService.get('userId');
        this.http.get(this.ApiUrl + 'services/serviceCompetence/' + userId)
          .subscribe(
            (data) => {
              this.serviceCompetence = data;
            },
            (error) => {
              console.error('Error:', error);
            }
          );
      }

      getCompetences() {
        this.http.get(this.ApiUrl + 'competences')
          .subscribe(
            (data) => {
              this.competences = data;
              
            },
            (error) => {
              console.error('Error:', error);
            }
          );
      }

    ngOnInit() { 
      this.getServices();
      this.getCompetences();
      this.getServiceSpecial();
      this.getServiceCompetence();
    }

    findCompetenceById(competenceId: string): any {
      return this.competences.find((competence: any) => competence._id === competenceId);
    }
}
