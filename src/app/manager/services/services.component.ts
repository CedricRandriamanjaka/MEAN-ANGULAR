import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from '../../sections/alerts-section/alerts-section.component';
import { config } from 'src/app/config/config';

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
  // model : NgbDate;
  model1: NgbDate;

  intituleField: string;
  descriptionField: string;
  dateDebutField: string;
  dateFinField: string;
  prixField: string;
  dureeField: string;
  commissionField: string;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  addService() {
    var intitule = (<HTMLInputElement>document.getElementById("intitule")).value;
    var description = (<HTMLInputElement>document.getElementById("description")).value;
    var prix = (<HTMLInputElement>document.getElementById("prix")).value;
    var duree = (<HTMLInputElement>document.getElementById("duree")).value;
    var commission = (<HTMLInputElement>document.getElementById("commission")).value;
    var debut = (<HTMLInputElement>document.getElementById("debut")).value;
    var fin = (<HTMLInputElement>document.getElementById("fin")).value;


    if (intitule == "" || description == "" || prix == "" || duree == "" || commission == "") {
      this.afficherAlerteChamp = true;
    }

    if (!Number.isInteger(parseInt(prix, 10)) || !Number.isInteger(parseInt(duree, 10)) || !Number.isInteger(parseInt(commission, 10))
      || isNaN(parseFloat(prix)) || isNaN(parseFloat(duree)) || isNaN(parseFloat(commission))) {
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
        nomService: intitule,
        description: description,
        prix: prix,
        duree: duree,
        commission: commission,
        dateDebut: debut,
        dateFin: fin,
        competences: selectedCompetences
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.post(config.apiUrl + 'services', jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res) => {
          alert('Service ajoutée');

        });
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
    console.log(service.intitule)
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

    this.intituleField = service.nom;
    this.descriptionField = service.description;
    this.prixField = service.prix;
    this.dureeField = service.duree;
    this.commissionField = service.commission;
    this.dateDebutField = service.dateDebut;
    this.dateFinField = service.dateFin;
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

  deleteService(serviceId: string) {
    this.http.delete(config.apiUrl + 'services/'+ serviceId)
    .toPromise().then((res) => {
      this.getServices();
      alert('Le service a bien été supprime');
    });
  }

  ngOnInit() {
    this.getServices();
    this.getCompetences();
  }

}
