import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { config } from 'src/app/config/config';


@Component({
  selector: 'app-horaire-employe',
  templateUrl: './horaire-employe.component.html',
  styleUrls: ['./horaire-employe.component.css']
})
export class HoraireEmployeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  focus: boolean = false;
  focus2: boolean = false;

  jour: string = "";
  heureDebut: string = "";
  heureFin: string = "";
  afficherAlerteChamp: boolean = false;
  jourArray: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];


  employees: any = [];
  horaires: any = [];

  getEmploye() {
    this.route.params.subscribe(params => {
      const employeeId = params['employeId'];
      console.log('Employee Id : ', employeeId);
      this.http.get(config.apiUrl + 'utilisateur/byId/'+ employeeId)
      .subscribe(
        (data: any) => {
          console.log('Employe:', data);
          this.employees = data;

        },
        (error) => {
          console.error('Error:', error);
        }
      );
  });
  }

  addHoraire() {
    this.route.params.subscribe(params => {
      const employeeId = params['employeId'];
      console.log('Employee Id : ', employeeId);
      console.log("date"+this.heureDebut);


    if (this.jour == "" || this.heureDebut == "" || this.heureFin == "") {
      this.afficherAlerteChamp = true;
    }

    else {

      var dataObject = {
        utilisateurID: employeeId,
        jour: this.jour,
        heureDebut: this.heureDebut,
        heureFin: this.heureFin,
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.post(config.apiUrl + 'horaire/nouveauHoraire', jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res) => {
          alert('Horaire ajouté');

      });

      this.getEmploye();
    }
    });
  }

  getHoraire(employeId) {
    this.http.get(config.apiUrl + 'horaire/utilisateur/' + employeId )
      .subscribe(
        (data: any) => {
          console.log('Horaire:', data);
          // this.horaires = data;
          this.horaires = this.jourArray.map(jour => {
            const dataObj = data.find(obj => obj.jour === this.jourArray.indexOf(jour) + 1);
            const valeur2 = dataObj ? dataObj.heureDebut : "00:00";
            const valeur3 = dataObj ? dataObj.heureFin : "00:00";
            return { heureDebut: valeur2, heureFin: valeur3, jour: jour, utilisateurID: data.utilisateurID};
          });
          
          // this.horaires.forEach(horaire => {
          //   console.log("this.horaire: " + horaire.heureDebut);
          // });

        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const employeeId = params['employeId'];
      console.log('Employee Id : ', employeeId);
      this.getHoraire(employeeId);
  });
    this.getEmploye();
    
  }

}
