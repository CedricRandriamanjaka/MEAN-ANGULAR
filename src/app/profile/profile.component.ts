import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    closeResult: string;
    utilisateur: any;
    competences: any = [];
    competencesUtilisateur: any = [];
    readonly ApiUrl = "http://localhost:3000/api/";

    constructor(private modalService: NgbModal, private http: HttpClient, private cookieService: CookieService) { }

    ngOnInit() {
        const userId = this.cookieService.get('userId');
        if (userId) { // Vérifiez si userId est défini pour éviter les requêtes inutiles
            this.getUtilisateur(userId);
            this.getCompetencesUtilisateur(userId);
            this.getCompetences();
        }

    }

    getUtilisateur(userId: string): void {
        this.http.get<any>('http://localhost:3000/api/utilisateur/getUtilisateur/' + userId, {})
            .subscribe(
                response => {
                    this.utilisateur = response;
                },
                error => {
                    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                }
            );
    }

    getCompetences(): void {
        this.http.get(this.ApiUrl + 'competences')
            .subscribe(
                (data) => {
                    console.log('Data:', data);
                    this.competences = data;
                },
                (error) => {
                    console.error('Error:', error);
                }
            );
    }

    getCompetencesUtilisateur(userId: string): void {
        this.http.get(this.ApiUrl + 'competences/utilisateur/' + userId)
            .subscribe(
                (data) => {
                    console.log('url:', this.ApiUrl + 'competences/utilisateur/' + userId);
                    this.competencesUtilisateur = data;
                },
                (error) => {
                    console.error('Error:', error);
                }
            );
    }

    ajouterCompetenceUtilisateur(competenceId: string): void {
        const userId = this.utilisateur._id;
        this.http.post(this.ApiUrl + 'profilEmployeretClient/competences/ajout/' + userId, { competenceID: competenceId })
            .subscribe(
                (data) => {
                    console.log('Compétence ajoutée avec succès à l\'utilisateur:', data);
                    // Actualiser la liste des compétences de l'utilisateur après l'ajout
                    this.getCompetencesUtilisateur(userId);
                },
                (error) => {
                    console.error('Erreur lors de l\'ajout de la compétence à l\'utilisateur:', error);
                }
            );
    }

    supprimerCompetenceUtilisateur(competenceId: string): void {
        const userId = this.utilisateur._id;
        this.http.post(this.ApiUrl + 'profilEmployeretClient/competences/supp/' + userId, { competenceID: competenceId })
            .subscribe(
                (data) => {
                    console.log('Compétence supprimer avec succès à l\'utilisateur:', data);
                    // Actualiser la liste des compétences de l'utilisateur après l'ajout
                    this.getCompetencesUtilisateur(userId);
                },
                (error) => {
                    console.error('Erreur lors de la suppresion de la compétence à l\'utilisateur:', error);
                }
            );
    }

    open(content, type, modalDimension) {
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

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}