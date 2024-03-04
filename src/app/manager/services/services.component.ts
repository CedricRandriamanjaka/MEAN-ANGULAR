import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from '../../sections/alerts-section/alerts-section.component';
import { config } from 'src/app/config/config';
import { NgForm } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  estEnModeModification: boolean = false;
  searchText: any;

  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;

  public files: NgxFileDropEntry[] = [];

  successAjoutService: string = '';
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
  focus14;
  // model : NgbDate;
  model1: NgbDate;

  intitule: string = "";
  description: string = "";
  dateDebut: any = "";
  dateFin: any = "";
  prix: string = "";
  duree: string = "";
  commission: string = "";
  image: any = "";

  idService: string;
  intituleField: string;
  descriptionField: string;
  dateDebutField: any = "";
  dateFinField: any = "";
  prixField: string;
  dureeField: string;
  commissionField: string;
  nomCompetenceField: string;
  imageField: any;
  competencesField: any = [];

  urlImage: string = config.baseUrl + "/Images/Service/";

  @ViewChild('serviceForm') form: NgForm;
  @ViewChild('maSection', { static: false }) maSection!: ElementRef;
  private modalRef: NgbModalRef;
  isLoadingService: boolean = true;
  isLoadingCompetence: boolean = true;


  constructor(private http: HttpClient, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) { }

  // Fonction pour convertir une image en base64
  convertToBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };



      // Lire le contenu de l'image en base64
      reader.readAsDataURL(file);
    });
  }

  async handleImageUpload(event: any) {
    const file: File = event.target.files[0];

    console.log(file);
    try {
      const base64String = await this.convertToBase64(file);
      console.log('Image en base64:', base64String);
    } catch (error) {
      console.error('Erreur lors de la conversion en base64:', error);
    }
  }

  toggleModifier(service) {
    this.estEnModeModification = true;

    setTimeout(() => {
      if (this.maSection) {
        this.maSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    this.idService = service._id;
    this.intituleField = service.nom;
    this.descriptionField = service.description;
    this.prixField = service.prix;
    this.dureeField = service.duree;
    this.commissionField = service.commission;
    if (service.dateDebut !== null && service.dateFin !== null) {
      this.dateDebutField = service.dateDebut.split("T")[0];
      this.dateFinField = service.dateFin.split("T")[0];
    }

    this.competencesField = this.competences.map(itemA => {
      const itemB = service.competences.find(itemB => itemB._id === itemA._id);
      // console.log(itemB)

      if (itemB) {
        return { ...itemA, isChecked: true };
      } else {
        return { ...itemA, isChecked: false };
      }
    });

    console.log('Intitule : ', this.intituleField);
    console.log('Description : ', this.descriptionField);
    console.log('Prix : ', this.prixField);
    console.log('Durée : ', this.dureeField);
    console.log('Commision : ', this.commissionField);
    console.log('Date Debut : ', this.dateDebutField);
    console.log('Date Fin : ', this.dateFinField);
    console.log('Competences : ', this.competencesField);
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.image = file;


          // You could upload it like this:
          // const formData = new FormData()
          // formData.append('logo', file, droppedFile.relativePath)

          // // Headers
          // const headers = new HttpHeaders({
          //   'security-token': 'mytoken'
          // })

          // this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          // .subscribe(data => {
          //   // Sanitized logo returned from backend
          // })


        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public droppedUpdate(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.imageField = file;


        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

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
    console.log('image:' + this.image);



    if (this.intitule == "" || this.description == "" || this.prix == "" || this.duree == "" || this.commission == "") {
      this.afficherAlerteChamp = true;
      this.alerts.unshift({
        id: 0,
        type: 'danger',
        strong: 'Error!',
        message: 'Veuillez remplir tous les champs',
        icon: 'fa fa-info'
      });
    }

    if (!Number.isInteger(parseInt(this.prix, 10)) || !Number.isInteger(parseInt(this.duree, 10)) || !Number.isInteger(parseInt(this.commission, 10))
      || isNaN(parseFloat(this.prix)) || isNaN(parseFloat(this.duree)) || isNaN(parseFloat(this.commission))) {
      this.afficherAlerteNumber = true;
      this.alerts.unshift({
        id: 0,
        type: 'danger',
        strong: 'Error!',
        message: 'Prix/Durée/Commission doit être un nombre.',
        icon: 'fa fa-info'
      });
    }

    if (debut > fin) {
      this.afficherAlerteDate = true;
      this.alerts.unshift({
        id: 0,
        type: 'danger',
        strong: 'Error!',
        message: 'La date de début est postérieure à la date de fin.',
        icon: 'fa fa-info'
      });
      console.log('La date de début est postérieure à la date de fin');
    }



    else {
      const selectedCompetences = this.competences.filter(comp => comp.isChecked);
      console.log('Compétences sélectionnées:', selectedCompetences);

      const competencesWithoutChecked = selectedCompetences.map(({ isChecked, ...rest }) => rest);
      console.log('Compétences sans isChecked:', competencesWithoutChecked);

      const competencesWithIdAndName = selectedCompetences.map(({ _id, nomCompetence }) => ({ _id, nomCompetence }));
      console.log('Compétences avec id et nomCompetence:', competencesWithIdAndName);

      var dataObject = {
        nomService: this.intitule,
        description: this.description,
        prix: this.prix,
        duree: this.duree,
        commission: this.commission,
        dateDebut: debut,
        dateFin: fin,
        competences: JSON.stringify(selectedCompetences)
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.post(config.apiUrl + 'services', jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res: any) => {
          console.log('res '+res.success);
          // alert('Service ajoutée');
          
          if (res.success) {
            this.getServices();
            this.clearFormService();
            this.alerts.unshift({
              id: 0,
              type: 'success',
              strong: 'Success! ',
              message: 'Service ajoutée avec succès',
              icon: 'ni ni-like-2'
            });
            
            
          } else {
            this.alerts.unshift({
              id: 0,
              type: 'danger',
              strong: 'Error! ',
              message: res.message,
              icon: 'ni ni-support-16'
            });
          }

        }).catch((error) => {
          console.error('Erreur lors de la modification du service:', error);
          this.alerts.unshift({
            id: 0,
            type: 'danger',
            strong: 'Error!',
            message: 'Un problème est survenu lors de l\'ajout d\'un service. Réessayer plus tard.',
            icon: 'ni ni-support-16'
          });
        });


      // var formData = new FormData();

      // // Ajoutez les autres champs au FormData
      // formData.append('nomService', this.intitule);
      // formData.append('description', this.description);
      // formData.append('prix', this.prix);
      // formData.append('duree', this.duree);
      // formData.append('commission', this.commission);
      // formData.append('dateDebut', debut);
      // formData.append('dateFin', fin);

      // if (this.image) {
      //   formData.append('image', this.image);
      // }

      // // Ajoutez d'autres champs si nécessaire
      // formData.append('competences', JSON.stringify(competencesWithIdAndName));

      // console.log('formData: ' + formData);

      // this.http.post(config.apiUrl + 'services', formData)
      //   .subscribe((response: any) => {
      //     if (response.type === 'success') {
      //       this.alerts.unshift({
      //         id: 0,
      //         type: response.type,
      //         strong: response.type + '! ',
      //         message: response.messageErreur,
      //         icon: 'ni ni-like-2'
      //       });
      //       // this.getServices();
      //       this.router.navigate(['/services'], {
      //         queryParams: {
      //           successAjout: "Service ajoutée avec succès"
      //         }
      //       });
      //     } else {
      //       this.alerts.unshift({
      //         id: 0,
      //         type: response.type,
      //         strong: response.type + '! ',
      //         message: response.messageErreur,
      //         icon: 'ni ni-support-16'
      //       });
      //     }

      //   }, error => {
      //     this.alerts.unshift({
      //       id: 0,
      //       type: 'danger',
      //       strong: 'Error!',
      //       message: 'Un problème est survenu lors de l\'ajout d\'un service. Réessayer plus tard.',
      //       icon: 'ni ni-support-16'
      //   });
      //     console.error('Error adding data', error);
      //   });

    }
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

  }

  clearFormService() {
    // Réinitialiser les valeurs des champs du formulaire
    this.intitule = '';
    this.description = '';
    this.prix = '';
    this.duree = '';
    this.commission = '';
    this.model = null; // Réinitialiser la date de début
    this.model1 = null; // Réinitialiser la date de fin
  
    // Réinitialiser les compétences sélectionnées
    this.competences.forEach((competence) => (competence.isChecked = false));
  }

  toggleCheckbox(competence: any) {
    console.log(competence.isChecked)
    competence.isChecked = !competence.isChecked;
  }

  getServices() {
    this.http.get(config.apiUrl + 'services')
      .toPromise()
      .then((data) => {
        console.log('Data:', data);
        this.services = data;
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .then(() => {
        // This block will be executed regardless of success or failure
        this.isLoadingService = false;
      });
  }

  getCompetences() {
    this.http.get<any[]>(config.apiUrl + 'competences').toPromise()
      .then(
        (data) => {
          console.log('Data:', data);
          this.competences = data.map(competence => ({ ...competence, isChecked: false }));

        }).catch((error) => {
          console.error('Error:', error);
        })
      .then(() => {
        // This block will be executed regardless of success or failure
        this.isLoadingCompetence = false;
      });
  }

  // open(content, type, modalDimension, service) {
  //   console.log(service.nom)
  //   if (modalDimension === 'sm' && type === 'modal_mini') {
  //     this.modalService.open(content, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //   } else if (modalDimension === '' && type === 'Notification') {
  //     this.modalService.open(content, { windowClass: 'modal-danger', centered: true }).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //   } else {
  //     this.modalService.open(content, { centered: true }).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });

  //   }

  //   // console.log('service.dateDebutField : ', service.dateDebutField);

  //   this.idService = service._id;
  //   this.intituleField = service.nom;
  //   this.descriptionField = service.description;
  //   this.prixField = service.prix;
  //   this.dureeField = service.duree;
  //   this.commissionField = service.commission;
  //   if (service.dateDebut !== null && service.dateFin !== null) {
  //     this.dateDebutField = service.dateDebut.split("T")[0];
  //     this.dateFinField = service.dateFin.split("T")[0];
  //   }

  //   this.competencesField = service.competences;

  //   console.log('Intitule : ', this.intituleField);
  //   console.log('Description : ', this.descriptionField);
  //   console.log('Prix : ', this.prixField);
  //   console.log('Durée : ', this.dureeField);
  //   console.log('Commision : ', this.commissionField);
  //   console.log('Date Debut : ', this.dateDebutField);
  //   console.log('Date Fin : ', this.dateFinField);
  //   console.log('Competences : ', this.competencesField);

  //   // if(this.form) {
  //   //   this.form.setValue({
  //   //     intitule: this.intituleField,  
  //   //     description: this.descriptionField, 
  //   //     prix: this.prixField,  
  //   //     duree: this.dureeField, 
  //   //     commission: this.commissionField, 
  //   //     dateDebut: this.dateDebutField,  
  //   //     dateFin: this.dateFinField
  //   //   });
  //   // }

  //   // console.log('this.form'+' : ', this.form);

  // }

  open1(content, type, modalDimension) {
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
      this.modalService.open(content, { centered: true }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

    }

  }

  close(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  // Fonction pour fermer une alerte
  closeAlert(alert: IAlert) {
    this.alerts.splice(this.alerts.indexOf(alert), 0);
  }

  addCompetence() {
    var dataObject = {
      nomCompetence: this.nomCompetenceField
    };

    var jsonData = JSON.stringify(dataObject);
    console.log('jsonData:' + jsonData);
    this.http.post(config.apiUrl + 'competences', jsonData, { headers: { 'Content-Type': 'application/json' } })
      .toPromise().then((res: any) => {
        
        this.getServices();
        this.getCompetences();
        // this.modalRef.close();
        alert('Compétences ajoutées avec succès');

      }), error => {
        alert('Erreur lors de l\'ajout de la compétence');
      };
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateService() {
    console.log("updateeee")
    console.log('Intitule : ', this.intituleField);
    console.log('Description : ', this.descriptionField);
    console.log('Prix : ', this.prixField);
    console.log('Durée : ', this.dureeField);
    console.log('Commision : ', this.commissionField);
    console.log('this.form' + ' : ', this.form);

    if (typeof this.dateDebutField === 'object' && this.dateDebutField instanceof Object) {
      this.dateDebutField = `${this.dateDebutField.year}-${this.pad(this.dateDebutField.month)}-${this.pad(this.dateDebutField.day)}`;
    }

    if (typeof this.dateFinField === 'object' && this.dateFinField instanceof Object) {
      this.dateFinField = `${this.dateFinField.year}-${this.pad(this.dateFinField.month)}-${this.pad(this.dateFinField.day)}`;
    }

    if (new Date(this.dateDebutField) > new Date(this.dateFinField)) {
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
        competences: JSON.stringify(this.competencesField)
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.put(config.apiUrl + 'services/' + this.idService, jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res) => {
          console.log('Data uploaded successfully', res);
          this.getServices();

          // alert('Service modifie');
          this.alerts.unshift({
            id: 0,
            type: 'success',
            strong: 'Success! ',
            message: 'Service modifiée avec succès',
            icon: 'ni ni-like-2'
          });
          
          this.estEnModeModification = false;

        }).catch((error) => {
          console.error('Erreur lors de la modification du service:', error);
        });

        this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));


      // var formData = new FormData();

      // // Ajoutez les autres champs au FormData
      // formData.append('nomService', this.intituleField);
      // formData.append('description', this.descriptionField);
      // formData.append('prix', this.prixField);
      // formData.append('duree', this.dureeField);
      // formData.append('commission', this.commissionField);
      // formData.append('dateDebut', this.dateDebutField);
      // formData.append('dateFin', this.dateFinField);

      // if (this.imageField) {
      //   formData.append('image', this.imageField);
      // }

      // const selectedCompetences = this.competencesField.filter(comp => comp.isChecked);
      // console.log('Compétences sélectionnées:', selectedCompetences);
      // // Ajoutez d'autres champs si nécessaire
      // formData.append('competences', JSON.stringify(selectedCompetences));

      // console.log('formData: ' + formData);

      // this.http.put(config.apiUrl + 'services/' + this.idService, formData)
      //   .subscribe((response: any) => {
      //     console.log('Data uploaded successfully', response);
      //     alert('Service modifiée');
      //     this.getServices();
      //     this.estEnModeModification = false;
      //   }, error => {
      //     console.error('Error uploading data', error);
      //   });

    }
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  deleteService(serviceId: string) {

    this.http.delete(config.apiUrl + 'services/' + serviceId)
      .toPromise().then((res) => {
        
        // alert('Le service a bien été supprime');
        this.alerts.unshift({
          id: 0,
          type: 'success',
          strong: 'Success! ',
          message: 'Service supprimée avec succès',
          icon: 'ni ni-like-2'
        });
        this.getServices();
      });

      this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));


  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const successAjout = params['successAjout'];
      if (successAjout) {
        this.alerts.unshift({
          id: 0,
          type: 'success',
          strong: 'Success! ',
          message: successAjout,
          icon: 'ni ni-like-2'
        });
      }
    });
    this.getServices();
    this.getCompetences();
  }


}
