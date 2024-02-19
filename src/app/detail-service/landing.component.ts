import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class detail implements OnInit {
  focus: any;
    closeResult: string;
    focus1: any;
  service: any;
  employes: any;
  competences: any = [];

  constructor(private modalService: NgbModal,private route: ActivatedRoute,private http: HttpClient) { }
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