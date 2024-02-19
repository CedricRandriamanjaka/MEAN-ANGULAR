import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeClient implements OnInit {
  services: any = [];
  competences: any = [];
    constructor(private http: HttpClient) { }

    readonly ApiUrl = "http://localhost:3000/api/";

      getServices() {
        this.http.get(this.ApiUrl + 'services')
          .subscribe(
            (data) => {
              console.log('Data Service:', data);
              this.services = data;
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
              console.log('Data competence:', data);
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
    }

    findCompetenceById(competenceId: string): any {
      return this.competences.find((competence: any) => competence._id === competenceId);
    }
}
