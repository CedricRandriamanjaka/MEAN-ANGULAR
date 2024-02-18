import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from 'src/app/sections/alerts-section/alerts-section.component';
import { config } from 'src/app/config/config';

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployesComponent implements OnInit {

  nom: string;
  prenom: string;
  email: string;
  date: string;
  genre: string;
  focus: boolean = false;

  employees: any = [];
  // private datePipe: DatePipe;
  myDate: Date = new Date("2024-03-03T00:00:00.000+00:00");
  formattedDate: string;

  afficherAlerteDate: boolean = false;
  afficherAlerteChamp: boolean = false;

  public alerts: Array<IAlert> = [];

  constructor(private http: HttpClient) {
   }

  addEmploye() {
    var date = (<HTMLInputElement>document.getElementById("date")).value;
    console.log("date"+this.date);
    console.log("date"+date);

    if (this.nom == "" || this.prenom == "" || this.email == "" || this.date == "" || this.genre == "") {
      this.afficherAlerteChamp = true;
    }

    else {

      var dataObject = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        dateNaissance: date,
        genre: this.genre,
        motdepasse: "mdp",
        etat: "actif",
        role: 2
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.post(config.apiUrl + 'utilisateur/nouveauUtilisateur', jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res) => {
          alert('Employe ajouté');

      });
    }

  }


  getAllEmployees() {
    this.http.get(config.apiUrl + 'utilisateur/byRole/1')
      .subscribe(
        (data) => {
          console.log('Data:', data);
          // console.log('Date:', this.datePipe.transform(data[0].dateNaissance), 'yyyy-MM-dd');
          this.employees = data;

        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  ngOnInit() {
    this.getAllEmployees();
  }

}
