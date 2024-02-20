import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { config } from 'src/app/config/config';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.css']
})
export class DepensesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  focus: boolean = false;
  focus2: boolean = false;
  focus3: boolean = false;

  description: string = "";
  montant: string = "";
  date: string = "";
  depenseType: string = "";
  afficherAlerteChamp: boolean = false;

  depenses: any = [];
  typeDepenses: any = [];

  addDepenses() {

    var date = (<HTMLInputElement>document.getElementById("date")).value;
      console.log("this.date"+this.date);
      console.log("date"+date);


    if (this.description == "" || this.montant == "" || this.date == "") {
      this.afficherAlerteChamp = true;
    }

    else {

      var dataObject = {
        depenseTypeID: this.depenseType,
        description: this.description,
        montant: this.montant,
        date: this.date,
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      // this.http.post(config.apiUrl + 'horaire/nouveauHoraire', jsonData, { headers: { 'Content-Type': 'application/json' } })
      //   .toPromise().then((res) => {
      //     alert('Horaire ajouté');

      // });

      this.getDepenses();
    }

  }

  getTypeDepenses() {
    this.http.get(config.apiUrl + 'depenses/types' )
      .subscribe(
        (data: any) => {
          console.log('TypeDepense:', data);
          this.typeDepenses = data;

        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  getDepenses() {
    this.http.get(config.apiUrl + 'depenses' )
      .subscribe(
        (data: any) => {
          console.log('Depense:', data);
          this.depenses = data;

        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  ngOnInit() {
    
    this.getDepenses();
    this.getTypeDepenses();
    
  }

}
