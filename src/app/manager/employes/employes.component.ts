import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { IAlert } from 'src/app/sections/alerts-section/alerts-section.component';
import { config } from 'src/app/config/config';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployesComponent implements OnInit {

  searchText:any;

  nom: string = "";
  prenom: string = "";
  email: string = "";
  date: string = "";
  genre: string = "";
  password: string = "";
  image: any = "";
  focus: boolean = false;

  focus2: boolean = false;
  focus3: boolean = false;
  focus4: boolean = false;
  focus5: boolean = false;
  focus6: boolean = false;

  focus1: boolean = false;
  focus7: boolean = false;
  focus8: boolean = false;
  focus9: boolean = false;
  focus10: boolean = false;

  focus11: boolean = false;
  focus12: boolean = false;


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
  passwordField: string;
  imageField: any;

  @ViewChild('employeForm') form: NgForm;
  @ViewChild('maSection', {static: false}) maSection!: ElementRef;
  estEnModeModification: boolean = false;

  urlImage: string = config.baseUrl + "/Images/Employe/";

  public files: NgxFileDropEntry[] = [];

  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;

  constructor(private http: HttpClient, private modalService: NgbModal, private router: Router, private route: ActivatedRoute) {
   }

   toggleModifier(employe) {
    this.estEnModeModification = true;

    setTimeout(() => {
      if (this.maSection) {
        this.maSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    this.idEmploye = employe._id;
    this.nomField = employe.nom;
    this.prenomField = employe.prenom;
    this.genreField = employe.genre;
    this.emailField = employe.email;
    this.passwordField = employe.motdepasse;
    this.dateNaissanceField = employe.dateNaissance.split("T")[0];
    this.imageField = employe.image;

    console.log('nomField:', this.nomField);
    console.log('prenomField:', this.prenomField);
    console.log('genreField:', this.genreField);
    console.log('emailField:', this.emailField);
    console.log('passwordField:', this.passwordField);
    console.log('dateNaissanceField:', employe.dateNaissance);
    // if(employe.image ?? false) {
    //   console.log('No Image');
    // }
    // else {
    //   console.log('image:', employe.image);
    // }
    

    
  }

  addEmploye() {
    var date = (<HTMLInputElement>document.getElementById("date")).value;
    console.log("date"+this.date);
    console.log("date"+date);

    if (this.nom == "" || this.prenom == "" || this.email == "" || this.date == "" || this.genre == "") {
      this.afficherAlerteChamp = true;
      this.alerts.unshift({
        id: 0,
        type: 'danger',
        strong: 'Error!',
        message: 'Veuillez remplir tous les champs',
        icon: 'fa fa-info'
      });
    }

    if(new Date(date) > new Date()) {
      this.afficherAlerteDate = true;
      this.alerts.unshift({
        id: 0,
        type: 'danger',
        strong: 'Error!',
        message: 'La date de naissance est postérieure à la date d\'aujourd\'hui.',
        icon: 'fa fa-info'
      });
    }

    else {

      var dataObject = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        dateNaissance: date,
        genre: this.genre,
        motdepasse: this.password,
        etat: "actif",
        role: 2
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.post(config.apiUrl + 'utilisateur/nouveauUtilisateur', jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res: any) => {
          if (res.type === 'success') {
            this.alerts.unshift({
              id: 0,
              type: res.type,
              strong: res.type + '! ',
              message: res.messageErreur,
              icon: 'ni ni-like-2'
            });
            this.getAllEmployees();
            // this.router.navigate(['/employes'], {
            //   queryParams: {
            //     successAjout: "Employé ajouté avec succès"
            //   }
            // });
          } else {
            this.alerts.unshift({
              id: 0,
              type: res.type,
              strong: res.type + '! ',
              message: res.messageErreur,
              icon: 'ni ni-support-16'
            });
          }

      }).catch((error) => {
        console.error('Error uploading data', error);
        this.alerts.unshift({
          id: 0,
          type: 'danger',
          strong: 'Error!',
          message: 'Un problème est survenu lors de l\'ajout d\'un employé. Réessayer plus tard.',
          icon: 'ni ni-support-16'
      });
      });

      // var formData = new FormData();

      // // Ajoutez les autres champs au FormData
      // formData.append('nom', this.nom);
      // formData.append('prenom', this.prenom);
      // formData.append('email', this.email);
      // formData.append('dateNaissance', date);
      // formData.append('genre', this.genre);
      // formData.append('motdepasse', this.password);
      // formData.append('etat', "actif");
      // formData.append('role', "2");

      // if (this.image) {
      //   formData.append('image', this.image);
      // }

      // console.log('formData: '+ formData);

      // this.http.post(config.apiUrl + 'utilisateur/nouveauUtilisateur', formData)
      // .subscribe((response: any) => {
      //   if (response.type === 'success') {
      //     this.alerts.unshift({
      //       id: 0,
      //       type: response.type,
      //       strong: response.type + '! ',
      //       message: response.messageErreur,
      //       icon: 'ni ni-like-2'
      //     });
      //     this.getAllEmployees();
      //     this.router.navigate(['/employes'], {
      //       queryParams: {
      //         successAjout: "Employé ajouté avec succès"
      //       }
      //     });
      //   } else {
      //     this.alerts.unshift({
      //       id: 0,
      //       type: response.type,
      //       strong: response.type + '! ',
      //       message: response.messageErreur,
      //       icon: 'ni ni-support-16'
      //     });
      //   }

      // }, error => {
      //   console.error('Error uploading data', error);
      //   this.alerts.unshift({
      //     id: 0,
      //     type: 'danger',
      //     strong: 'Error!',
      //     message: 'Un problème est survenu lors de l\'ajout d\'un employé. Réessayer plus tard.',
      //     icon: 'ni ni-support-16'
      // });
      // });

      
    }

    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

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
    console.log('dateNaissanceField:', employe.dateNaissance);


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
    console.log('passwordField:', this.passwordField);
    
    
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
        motdepasse: this.passwordField,
        etat: "actif",
        role: 2
      };

      var jsonData = JSON.stringify(dataObject);
      console.log('jsonData:' + jsonData);

      this.http.put(config.apiUrl + 'utilisateur/modifierUtilisateur/'+ this.idEmploye, jsonData, { headers: { 'Content-Type': 'application/json' } })
        .toPromise().then((res) => {
          console.log('Data uploaded successfully', res);
        alert('Employé modifié');
        this.getAllEmployees();
        this.estEnModeModification = false;

      }).catch((error) => {
        console.error('Error uploading data', error);
      });

      // var formData = new FormData();

      // // Ajoutez les autres champs au FormData
      // formData.append('nom', this.nomField);
      // formData.append('prenom', this.prenomField);
      // formData.append('email', this.emailField);
      // formData.append('dateNaissance', this.dateNaissanceField);
      // formData.append('genre', this.genreField);
      // formData.append('motdepasse', "mdp");
      // formData.append('etat', "actif");
      // formData.append('role', "2");

      // if (this.imageField) {
      //   formData.append('image', this.imageField);
      // }

      // console.log('formData: '+ formData);

      // this.http.put(config.apiUrl + 'utilisateur/modifierUtilisateur/'  + this.idEmploye , formData)
      // .subscribe((response: any) => {
      //   console.log('Data uploaded successfully', response);
      //   alert('Employé modifié');
      //   this.getAllEmployees();
      //   this.estEnModeModification = false;
      // }, error => {
      //   console.error('Error uploading data', error);
      // });

    }
  }

  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  redirectHoraireEmploye(employe) {
    console.log("redirectHoraireEmploye"+employe._id);
    this.router.navigate(['/horaire', employe._id]);
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

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  deleteEmployee(employeId: string) {

    this.http.delete(config.apiUrl + 'utilisateur/supprimerUtilisateur/'+ employeId)
    .toPromise().then((res) => {
      
      this.getAllEmployees();
      alert('L\'employé a bien été supprimé');
    });
  }

  ngOnInit() {
    this.getAllEmployees();
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
  }

}
