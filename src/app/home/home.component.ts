import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  services: any = [];
  competences: any = [];
  selectedCompetences: string[] = [];
    model = {
        left: true,
        middle: false,
        right: false
    };

    focus;
    focus1;
    // model : NgbDate;
    model1 : NgbDate;
    constructor(private http: HttpClient) { }

    readonly ApiUrl = "http://localhost:3000/api/";

    addService() {
        var intitule = (<HTMLInputElement>document.getElementById("intitule")).value;
        var description = (<HTMLInputElement>document.getElementById("description")).value;
        var prix = (<HTMLInputElement>document.getElementById("prix")).value;
        var duree = (<HTMLInputElement>document.getElementById("duree")).value;
        var commission = (<HTMLInputElement>document.getElementById("commission")).value;
        var debut = (<HTMLInputElement>document.getElementById("debut")).value;
        var fin = (<HTMLInputElement>document.getElementById("fin")).value;
        var dataObject = {
          nomService: intitule,
          description: description,
          prix: prix,
          duree: duree,
          commission: commission,
          dateDebut: debut,
          dateFin: fin
        };
        var jsonData = JSON.stringify(dataObject);
        console.log(jsonData);
    
        // this.http.post(this.ApiUrl + 'services', jsonData, { headers: { 'Content-Type': 'application/json' } })
        //   .toPromise().then((res) => {
        //     alert('Service ajoutée');
        //   });
      }

      getServices() {
        this.http.get(this.ApiUrl + 'services')
          .subscribe(
            (data) => {
              console.log('Data:', data);
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
              console.log('Data:', data);
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
}
