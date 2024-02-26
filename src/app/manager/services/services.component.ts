import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from '../../sections/alerts-section/alerts-section.component';
import { config } from 'src/app/config/config';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  public alerts: Array<IAlert> = [];

  closeResult: string;
  services: any = [];
  competences: any[] = [];
  selectedCompetences: string[] = [];
  afficherAlerteDate: boolean = false;
  afficherAlerteChamp: boolean = false;
  afficherAlerteNumber: boolean = false;
  model = {
    left: true,
    middle: false,
    right: false
  };

  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  focus5;
  focus6;
  focus7;
  focus8;

  focus9;
  focus10;
  focus11;
  focus12;
  focus13;
  // model : NgbDate;
  model1: NgbDate;

  intitule: string = "";
  description: string = "";
  dateDebut: any = "";
  dateFin: any = "";
  prix: string = "";
  duree: string = "";
  commission: string = "";

  idService: string;
  intituleField: string;
  descriptionField: string;
  dateDebutField: any = "";
  dateFinField: any = "";
  prixField: string;
  dureeField: string;
  commissionField: string;
  competencesField: any = [];

  @ViewChild('serviceForm') form: NgForm;


  constructor(private http: HttpClient, private modalService: NgbModal) { }

  addService() {
    // var intitule = (<HTMLInputElement>document.getElementById("intitule")).value;
    // var description = (<HTMLInputElement>document.getElementById("description")).value;
    // var prix = (<HTMLInputElement>document.getElementById("prix")).value;
    // var duree = (<HTMLInputElement>document.getElementById("duree")).value;
    // var commission = (<HTMLInputElement>document.getElementById("commission")).value;
    var debut = (<HTMLInputElement>document.getElementById("debut")).value;
    var fin = (<HTMLInputElement>document.getElementById("fin")).value;

    console.log('intitule: ' + this.intitule);
    console.log('description:' + this.description);
    console.log('prix:' + this.prix);
    console.log('duree:' + this.duree);
    console.log('commission:' + this.commission);



    if (this.intitule == "" || this.description == "" || this.prix == "" || this.duree == "" || this.commission == "") {
      this.afficherAlerteChamp = true;
    }

    if (!Number.isInteger(parseInt(this.prix, 10)) || !Number.isInteger(parseInt(this.duree, 10)) || !Number.isInteger(parseInt(this.commission, 10))
      || isNaN(parseFloat(this.prix)) || isNaN(parseFloat(this.duree)) || isNaN(parseFloat(this.commission))) {
      this.afficherAlerteNumber = true;
    }

    if (debut > fin) {
      this.afficherAlerteDate = true;
      this.alerts.unshift({
        id: 0,
        type: 'danger',
        strong: 'Error!',
        message: 'La date de début est postérieure à la date de fin.',
        icon: 'ni ni-support-16'
      });
      console.log('La date de début est postérieure à la date de fin');
    }

    else {
      const selectedCompetences = this.competences.filter(comp => comp.isChecked);
      console.log('Compétences sélectionnées:', selectedCompetences);

      var dataObject = {
        nomService: this.intitule,
        description: this.description,
        prix: this.prix,
        duree: this.duree,
        commission: this.commission,
        dateDebut: debut,
        dateFin: fin,
        competences: selectedCompetences
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      // this.http.post(config.apiUrl + 'services', jsonData, { headers: { 'Content-Type': 'application/json' } })
      //   .toPromise().then((res) => {
      //     alert('Service ajoutée');

      //   });
      this.getServices();
    }

  }

  toggleCheckbox(competence: any) {
    console.log(competence.isChecked)
    competence.isChecked = !competence.isChecked;
  }

  getServices() {
    this.http.get(config.apiUrl + 'services')
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
    this.http.get<any[]>(config.apiUrl + 'competences')
      .subscribe(
        (data) => {
          console.log('Data:', data);
          this.competences = data.map(competence => ({ ...competence, isChecked: false }));

        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  open(content, type, modalDimension, service) {
    console.log(service.nom)
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

    // console.log('service.dateDebutField : ', service.dateDebutField);

    this.idService = service._id;
    this.intituleField = service.nom;
    this.descriptionField = service.description;
    this.prixField = service.prix;
    this.dureeField = service.duree;
    this.commissionField = service.commission;
    if(service.dateDebut !== null && service.dateFin !== null ) {
      this.dateDebutField = service.dateDebut.split("T")[0];
      this.dateFinField = service.dateFin.split("T")[0];
    }
    
    this.competencesField = service.competences;

    console.log('Intitule : ', this.intituleField);
    console.log('Description : ', this.descriptionField);
    console.log('Prix : ', this.prixField);
    console.log('Durée : ', this.dureeField);
    console.log('Commision : ', this.commissionField);
    console.log('Date Debut : ', this.dateDebutField);
    console.log('Date Fin : ', this.dateFinField);
    console.log('Competences : ', this.competencesField);

    if(this.form) {
      this.form.setValue({
        intitule: this.intituleField,  
        description: this.descriptionField, 
        prix: this.prixField,  
        duree: this.dureeField, 
        commission: this.commissionField, 
        dateDebut: this.dateDebutField,  
        dateFin: this.dateFinField
      });
    }
    
    console.log('this.form'+' : ', this.form);

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

updateService() {
  console.log("updateeee")
  console.log('Intitule : ', this.intituleField);
    console.log('Description : ', this.descriptionField);
    console.log('Prix : ', this.prixField);
    console.log('Durée : ', this.dureeField);
    console.log('Commision : ', this.commissionField);
    console.log('this.form'+' : ', this.form);

  if (typeof this.dateDebutField === 'object' && this.dateDebutField instanceof Object) {
    this.dateDebutField = `${this.dateDebutField.year}-${this.pad(this.dateDebutField.month)}-${this.pad(this.dateDebutField.day)}`;
  }

  if (typeof this.dateFinField === 'object' && this.dateFinField instanceof Object) {
    this.dateFinField = `${this.dateFinField.year}-${this.pad(this.dateFinField.month)}-${this.pad(this.dateFinField.day)}`;
  }

  if(new Date(this.dateDebutField) > new Date(this.dateFinField)) {
    this.afficherAlerteDate = true;
  }

  else {
    console.log('dateDebutField:', this.dateDebutField);
    console.log('dateFinField:', this.dateFinField);
    console.log('Competences:', this.competencesField);
    
      var dataObject = {
        nomService: this.intituleField,
        description: this.descriptionField,
        prix: this.prixField,
        duree: this.dureeField,
        commission: this.commissionField,
        dateDebut: this.dateDebutField,
        dateFin: this.dateFinField,
        competences: this.competencesField
      };

    var jsonData = JSON.stringify(dataObject);
    console.log('jsonData:' + jsonData);

    // this.http.put(config.apiUrl + 'services/'+ this.idService, jsonData, { headers: { 'Content-Type': 'application/json' } })
    //   .toPromise().then((res) => {
    //     alert('Service modifie');

    // });

    this.getServices();
  }
}

pad(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

  deleteService(serviceId: string) {
    console.log('this.form'+' : ', this.form);

    // this.http.delete(config.apiUrl + 'services/'+ serviceId)
    // .toPromise().then((res) => {
    //   this.getServices();
    //   alert('Le service a bien été supprime');
    // });
  }

  ngOnInit() {
    this.getServices();
    this.getCompetences();
  }


}
