import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  nom: string = "";
  prenom: string = "";
  email: string = "";
  date: string = "";
  genre: string = "";
  focus: boolean = false;

  focus2: boolean = false;
  focus3: boolean = false;
  focus4: boolean = false;
  focus5: boolean = false;
  focus6: boolean = false;

  closeResult: string;

  employees: any = [];
  // private datePipe: DatePipe;
  myDate: Date = new Date("2024-03-03T00:00:00.000+00:00");
  formattedDate: string;

  afficherAlerteDate: boolean = false;
  afficherAlerteChamp: boolean = false;

  idEmploye: string;
  nomField: string;
  prenomField: string;
  emailField: string;
  dateNaissanceField: any;
  genreField: string;

  public alerts: Array<IAlert> = [];

  constructor(private http: HttpClient, private modalService: NgbModal) {
   }

  addEmploye() {
    var date = (<HTMLInputElement>document.getElementById("date")).value;
    console.log("date"+this.date);
    console.log("date"+date);

    if (this.nom == "" || this.prenom == "" || this.email == "" || this.date == "" || this.genre == "") {
      this.afficherAlerteChamp = true;
    }

    if(new Date(date) > new Date()) {
      this.afficherAlerteDate = true;
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

      this.getAllEmployees();
    }

  }

  open(content, type, modalDimension, employe) {
    console.log(employe.nom)
    if (modalDimension === 'sm' && type === 'modal_mini') {
        this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    } else if (modalDimension === '' && type === 'Notification') {
      this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
        this.modalService.open(content,{ centered: true }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        
    }

    this.idEmploye = employe._id;
    this.nomField = employe.nom;
    this.prenomField = employe.prenom;
    this.genreField = employe.genre;
    this.emailField = employe.email;
    this.dateNaissanceField = employe.dateNaissance.split("T")[0];

    console.log('nomField:', this.nomField);
    console.log('prenomField:', this.prenomField);
    console.log('genreField:', this.genreField);
    console.log('emailField:', this.emailField);
    console.log('dateNaissanceField:', employe.dateNaissance.split("T")[0]);


}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
  } else {
      return  `with: ${reason}`;
  }
}


  getAllEmployees() {
    this.http.get(config.apiUrl + 'utilisateur/byRole/2')
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

  updateEmployee() {
    console.log("updateeee")
    console.log('nomField:', this.nomField);
    console.log('prenomField:', this.prenomField);
    console.log('genreField:', this.genreField);
    console.log('emailField:', this.emailField);
    
    
    // console.log('type:', typeof this.dateNaissanceField);

    if (typeof this.dateNaissanceField === 'object' && this.dateNaissanceField instanceof Object) {
      this.dateNaissanceField = `${this.dateNaissanceField.year}-${this.pad(this.dateNaissanceField.month)}-${this.pad(this.dateNaissanceField.day)}`;
    }

    if(new Date(this.dateNaissanceField) > new Date()) {
      this.afficherAlerteDate = true;
    }

    else {
      console.log('dateNaissanceField:', this.dateNaissanceField);
      var dataObject = {
        nom: this.nomField,
        prenom: this.prenomField,
        email: this.emailField,
        dateNaissance: this.dateNaissanceField,
        genre: this.genreField,
        motdepasse: "mdp",
        etat: "actif",
        role: 2
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.put(config.apiUrl + 'utilisateur/modifierUtilisateur/'+ this.idEmploye, jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res) => {
          alert('Employe modifie');

      });

      this.getAllEmployees();
    }
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  ngOnInit() {
    this.getAllEmployees();
  }

}
