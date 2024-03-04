import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { config } from "src/app/config/config";
import { IAlert } from "src/app/sections/alerts-section/alerts-section.component";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-depenses",
  templateUrl: "./depenses.component.html",
  styleUrls: ["./depenses.component.css"],
})
export class DepensesComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) { }

  focus: boolean = false;
  focus2: boolean = false;
  focus3: boolean = false;
  focus4: boolean = false;
  typeField: string;
  closeResult: string;

  isLoadingDepense: boolean = true;

  private modalRef: NgbModalRef;

  description: string = "";
  montant: string = "";
  date: string = "";
  depenseType: string = "";
  afficherAlerteChamp: boolean = false;

  mois: number = 0;
  jour: number = 0;
  annee: number = 0;

  currentYear = new Date().getFullYear();
  startYear = 2010;

  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;

  public days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString(),
  }));
  public years = Array.from(
    { length: this.currentYear - this.startYear + 1 },
    (_, index) => (this.startYear + index).toString()
  );

  public months = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  depenses: any = [];
  typeDepenses: any = [];

  addDepenses() {
    var date = (<HTMLInputElement>document.getElementById("date")).value;
    console.log("this.date" + this.date + "dskvd");
    console.log("date" + date + "djvk");

    if (this.description == "" || this.montant == "" || date == "") {
      this.afficherAlerteChamp = true;
      this.alerts.unshift({
        id: 0,
        type: "danger",
        strong: "Error!",
        message: "Veuillez remplir tous les champs",
        icon: "fa fa-info",
      });
    } else {
      var dataObject = {
        depenseTypeID: this.depenseType,
        description: this.description,
        montant: this.montant,
        date: date,
      };

      var jsonData = JSON.stringify(dataObject);
      console.log("jsonData:" + jsonData);

      this.http
        .post(config.apiUrl + "depenses", jsonData, {
          headers: { "Content-Type": "application/json" },
        })
        .toPromise()
        .then((res: any) => {
          if (res.success) {
            this.getDepenses();
            this.clearFormDepense();
            this.alerts.unshift({
              id: 0,
              type: 'success',
              strong: 'Success! ',
              message: 'Dépense ajoutée avec succès',
              icon: 'ni ni-like-2'
            });
            
            // this.router.navigate(["/depenses"], {
            //   queryParams: {
            //     successAjout: "Dépense ajoutée avec succès",
            //   },
            // });
          } else {
            this.alerts.unshift({
              id: 0,
              type: 'danger',
              strong: 'Error! ',
              message: res.message,
              icon: 'ni ni-support-16'
            });
          }

          // alert('Dépense ajouté');
        })
        .catch((error) => {
          this.alerts.unshift({
            id: 0,
            type: "danger",
            strong: "Error!",
            message:
              "Un problème est survenu lors de l'ajout d'un service. Réessayer plus tard.",
            icon: "ni ni-support-16",
          });
          console.error("Error adding data", error);
        });

    }
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
  }

  clearFormDepense() {
    // Réinitialiser les valeurs des champs du formulaire
    this.depenseType = "";
    this.description = '';
    this.montant = '';
    this.date = null;

  }

  filtreDepense(mois, jour) {
    this.mois = mois;
    this.jour = jour;
    console.log("this.mois" + this.mois);
    console.log("this.jour" + this.jour);
    this.getDepenses();
  }

  open1(content, type, modalDimension) {
    if (modalDimension === "sm" && type === "modal_mini") {
      this.modalService
        .open(content, {
          windowClass: "modal-mini",
          size: "sm",
          centered: true,
        })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else if (modalDimension === "" && type === "Notification") {
      this.modalService
        .open(content, { windowClass: "modal-danger", centered: true })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } else {
      this.modalService.open(content, { centered: true }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  addTypeDepense() {
    var dataObject = {
      nomDepense: this.typeField,
    };

    var jsonData = JSON.stringify(dataObject);

    console.log("jsonData:" + jsonData);

    this.http
      .post(config.apiUrl + "depenses/types", jsonData, {
        headers: { "Content-Type": "application/json" },
      })

      .toPromise()
      .then((res: any) => {
        alert("Type de dépense ajouté avec succès");

        this.getDepenses();

        this.getTypeDepenses();

        this.modalRef.close();
      }),
      (error) => {
        alert("Erreur lors de l'ajout du type de dépense");
      };
  }

  closeAlert(alert: IAlert) {
    this.alerts.splice(this.alerts.indexOf(alert), 0);
  }

  getTypeDepenses() {
    this.http.get(config.apiUrl + "depenses/types").subscribe(
      (data: any) => {
        console.log("TypeDepense:", data);
        this.typeDepenses = data;
      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }

  getDepenses() {
    this.http
      .get(
        config.apiUrl +
        "depenses/annee=" +
        this.annee +
        "/mois=" +
        this.mois +
        "/jour=" +
        this.jour
      ).toPromise()
      .then(
        (data: any) => {
          console.log("Depense:", data);
          this.depenses = data;
        }
      ).catch((error) => {
        console.error('Error:', error);
      })
      .then(() => {
        this.isLoadingDepense = false;
      });
  }

  deleteDepense(depenseId: string) {
    this.http
      .delete(config.apiUrl + "depenses/" + depenseId)
      .toPromise()
      .then((res) => {
        this.alerts.unshift({
          id: 0,
          type: 'success',
          strong: 'Success! ',
          message: 'Dépense supprimée avec succès',
          icon: 'ni ni-like-2'
        });
        this.getDepenses();
        this.getTypeDepenses();
        // alert("La dépense a bien été supprimée");

      });

      this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
  }

  ngOnInit() {
    this.getDepenses();
    this.getTypeDepenses();
    // console.log(this.years)
  }
  // Fonction pour fermer une alerte
  close(alert: IAlert) {
    this.alerts.splice(this.alerts.indexOf(alert), 0);
  }
}
