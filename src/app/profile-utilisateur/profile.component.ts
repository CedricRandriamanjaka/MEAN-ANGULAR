import { Component, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileUtilisateur implements OnInit {
    closeResult: string;
    utilisateur: any;
    competences: any = [];
    competencesUtilisateur: any = [];

    employes: any;
    favoris:any;

    competencesUpdated: EventEmitter<any> = new EventEmitter<any>();
    favorisUpdated: EventEmitter<any> = new EventEmitter<any>();
    readonly ApiUrl = "http://localhost:3000/api/";

    constructor(private modalService: NgbModal, private http: HttpClient, private cookieService: CookieService) { }

    ngOnInit() {
        this.competencesUpdated.subscribe((competences: any) => {
            this.competencesUtilisateur = competences;
        });

        this.favorisUpdated.subscribe((employes: any) => {
            this.favoris = employes;
        });

        const userId = this.cookieService.get('userId');
        if (userId) {
            this.getUtilisateur(userId);
            this.getCompetencesUtilisateur(userId);
            this.getCompetences();
            this.getEmployes();
            this.getFavoris(userId);
        }
    }

    getUtilisateur(userId: string): void {
        this.http.get<any>(this.ApiUrl + 'utilisateur/getUtilisateur/' + userId, {})
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

    getEmployes(): void {
        this.http.get(this.ApiUrl + 'utilisateur/byRole/'+'2')
            .subscribe(
                (data) => {
                    console.log('Data:', data);
                    this.employes = data;
                },  
                (error) => {
                    console.error('Error:', error);
                }
            );
    }

    getFavoris(userId: string): void {
        this.http.get(this.ApiUrl + 'favori/utilisateur/' + userId)
            .subscribe(
                (data) => {
                    console.log('url:', this.ApiUrl + 'favori/utilisateur/' + userId);
                    this.favoris = data;
                },
                (error) => {
                    console.error('Error:', error);
                }
            );
    }


    ajouterCompetenceUtilisateur(competenceId: string): void {
        const userId = this.utilisateur._id;
        const competenceToAdd = this.competences.find(comp => comp._id === competenceId); // Trouver la compétence dans la liste complète des compétences
    
        this.http.post(this.ApiUrl + 'profilEmployeretClient/competences/ajout/' + userId, { competenceID: competenceId })
            .subscribe(
                (data) => {
                    if(data){

                        // Mise à jour locale des compétences de l'utilisateur
                        if (competenceToAdd) {
                            this.competencesUtilisateur.push(competenceToAdd); // Ajouter la compétence à la liste locale si elle existe
                        }
                        this.competencesUpdated.emit(this.competencesUtilisateur); // Émettre l'événement avec les données mises à jour
                        console.log('Compétences utilisateur mises à jour:', JSON.stringify(this.competencesUtilisateur));
                    }
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
                    console.log('Compétence supprimée avec succès à l\'utilisateur:', data);
                    // Mise à jour locale des compétences de l'utilisateur
                    this.competencesUtilisateur = this.competencesUtilisateur.filter(comp => comp._id !== competenceId); // Supprimez la compétence de la liste locale
                    this.competencesUpdated.emit(this.competencesUtilisateur); // Émettez l'événement avec les données mises à jour
                },
                (error) => {
                    console.error('Erreur lors de la suppression de la compétence à l\'utilisateur:', error);
                }
            );
    }

    ajouterFavoriUtilisateur(empID: string): void {
        const userId = this.utilisateur._id;
        const favToAdd = this.employes.find(comp => comp._id === empID); // Trouver la compétence dans la liste complète des compétences
    
        this.http.post(this.ApiUrl + 'favori/ajout/' + userId, { empID: empID })
            .subscribe(
                (data) => {
                    if(data){

                        // Mise à jour locale des compétences de l'utilisateur
                        if (favToAdd) {
                            this.favoris.push(favToAdd); // Ajouter la compétence à la liste locale si elle existe
                        }
                        this.favorisUpdated.emit(this.favoris); // Émettre l'événement avec les données mises à jour
                        console.log('favori utilisateur mises à jour:', JSON.stringify(this.favoris));
                    }
                },
                (error) => {
                    console.error('Erreur lors de l\'ajout favori à l\'utilisateur:', error);
                }
            );
    }

    supprimerFavoriUtilisateur(empID: string): void {
        const userId = this.utilisateur._id;
        this.http.post(this.ApiUrl + 'favori/supp/' + userId, { empID: empID })
            .subscribe(
                (data) => {
                    console.log('favori supprimée avec succès à l\'utilisateur:', data);
                    // Mise à jour locale des compétences de l'utilisateur
                    this.favoris = this.favoris.filter(comp => comp._id !== empID); // Supprimez la compétence de la liste locale
                    this.favorisUpdated.emit(this.favoris); // Émettez l'événement avec les données mises à jour
                },
                (error) => {
                    console.error('Erreur lors de la suppression de favori à l\'utilisateur:', error);
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