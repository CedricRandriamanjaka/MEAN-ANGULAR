import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAlert } from '../sections/alerts-section/alerts-section.component'; // Importez l'interface IAlert
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test: Date = new Date();
    focus;
    focus1;
    focus2;
    nom: string;
    prenom: string;
    dateNaissance: Date;
    genre: string;
    email: string;
    motDePasse: string;
    focusNom: boolean;
    focusPrenom: boolean;
    focusDateNaissance: boolean;
    focusEmail: boolean;
    focusMotDePasse: boolean;

    readonly ApiUrl = "https://mean-m1-1-vten.onrender.com/api/";
    // readonly ApiUrl = "http://localhost:3000/api/";


    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() { }

    public alerts: Array<IAlert> = [];
    private backup: Array<IAlert>;
    createAccount() {
        const userData = {
            nom: this.nom,
            prenom: this.prenom,
            dateNaissance: this.dateNaissance,
            genre: this.genre,
            email: this.email,
            motdepasse: this.motDePasse
        };

        this.http.post<any>(this.ApiUrl+'utilisateur/inscription', userData)
            .subscribe(
                response => {

                    if (response.type === 'success') {
                        this.alerts.unshift({
                            id: 0,
                            type: response.type,
                            strong: response.type + '! ',
                            message: response.messageErreur,
                            icon: 'ni ni-like-2'
                        });
                        this.router.navigate(['/login'], {
                            queryParams: {
                                successInscription: "votre inscription a ete valide"
                            }
                        });
                    } else {
                        this.alerts.unshift({
                            id: 0,
                            type: response.type,
                            strong: response.type + '! ',
                            message: response.messageErreur,
                            icon: 'ni ni-support-16'
                        });
                    }
                    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
                    console.log(response);
                },
                error => {
                    // Si la création de compte échoue, affichez un message d'erreur
                    this.alerts.unshift({
                        id: 0,
                        type: 'danger',
                        strong: 'Error!',
                        message: 'An error occurred while creating your account. Please try again later.',
                        icon: 'ni ni-support-16'
                    });
                    console.error(error);
                }
            );
    }
    // Fonction pour fermer une alerte
    close(alert: IAlert) {
        this.alerts.splice(this.alerts.indexOf(alert), 0);
    }
}
