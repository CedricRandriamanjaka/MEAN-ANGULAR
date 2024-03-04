import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { config } from 'src/app/config/config';
import { IAlert } from 'src/app/sections/alerts-section/alerts-section.component';


@Component({
  selector: 'app-horaire-employe',
  templateUrl: './horaire-employe.component.html',
  styleUrls: ['./horaire-employe.component.css']
})
export class HoraireEmployeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  focus: boolean = false;
  focus2: boolean = false;
  isLoadingHoraire: boolean = true;

  jour: string = "";
  heureDebut: string = "";
  heureFin: string = "";
  afficherAlerteChamp: boolean = false;
  jourArray: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];


  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;

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

  closeAlert(alert: IAlert) {
    this.alerts.splice(this.alerts.indexOf(alert), 0);
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
          // alert('Horaire ajouté');

          this.getHoraire(employeeId);
          this.getEmploye();
          this.clearFormHoraire();
            this.alerts.unshift({
              id: 0,
              type: 'success',
              strong: 'Success! ',
              message: 'Horaire ajoutée avec succès',
              icon: 'ni ni-like-2'
            });


      }).catch((error) => {
        console.error('Error uploading data', error);
        this.alerts.unshift({
          id: 0,
          type: 'danger',
          strong: 'Error!',
          message: 'Un problème est survenu lors de l\'ajout d\'une horaire. Réessayer plus tard.',
          icon: 'ni ni-support-16'
      });
      });

      
    }
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
    });
  }

  clearFormHoraire() {
    // Réinitialiser les valeurs des champs du formulaire
    this.jour = "";
    this.heureDebut = "";
    this.heureFin = "";
  }

  getHoraire(employeId) {
    this.http.get(config.apiUrl + 'horaire/utilisateur/' + employeId ).toPromise()
      .then(
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

        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .then(() => {
          // This block will be executed regardless of success or failure
          this.isLoadingHoraire = false;
        });
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
