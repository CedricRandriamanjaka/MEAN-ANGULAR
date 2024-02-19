import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class detail implements OnInit {
  focus: any;
  focus1: any;
  service: any;
  employes: any;
  competences: any = [];

  constructor(private route: ActivatedRoute,private http: HttpClient) { }
  readonly ApiUrl = "http://localhost:3000/api/";

  getService(serviceId:String) {
    this.http.get(this.ApiUrl + 'services/'+serviceId)
      .subscribe(
        (data) => {
          console.log('Data service:', data);
          this.service = data;
          
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
getCompetences() {
  this.http.get(this.ApiUrl + 'competences')
    .subscribe(
      (data) => {
        console.log('Data competence:', data);
        this.competences = data;
        
      },
      (error) => {
        console.error('Error:', error);
      }
    );
}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getService(params['id']);
    });
    this.getEmployes();
    this.getCompetences();

  }
  
  findCompetenceById(competenceId: string): any {
    return this.competences.find((competence: any) => competence._id === competenceId);
  }
}
