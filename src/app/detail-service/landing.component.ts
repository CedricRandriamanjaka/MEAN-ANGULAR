import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Importer explicitement le plugin timeGrid
import interactionPlugin from '@fullcalendar/interaction'; // Importer interactionPlugin depuis le package @fullcalendar/interaction

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
  viewDate : Date = new Date();

  intevalDate : any;
  calendar : any;
  

  constructor(private modalService: NgbModal,private route: ActivatedRoute,private http: HttpClient) { }
  readonly ApiUrl = "http://localhost:3000/api/";

  private initialiserFullCalendar() {
    var now = new Date();
    // Récupérer l'heure et les minutes actuelles
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();
    // Définir la date de début avec l'heure et les minutes actuelles
    var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, currentMinute);
    // Définir la date de fin comme étant 14 jours plus tard à la même heure et minutes que maintenant
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, currentHour, currentMinute);
  
    var calendarEl = document.getElementById('calendar');
    this.calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin,interactionPlugin],
      initialView: 'timeGridWeek',
      slotDuration: '01:00:00',
      slotLabelInterval: { hours: 1 },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      locale: 'fr',
      nowIndicator: true,
      height: 'auto',
      validRange: {
        start: startDate,
        end: endDate
      },
      editable: true,
    droppable: true,
    drop: function(info) {}
    });
    this.calendar.render();
  }

  getIndispoDate(employeID) {
    this.http.get<any[]>(this.ApiUrl + 'utilisateur/getIndispoDate/' + employeID + '/' + this.service._id)
      .subscribe(
        (data) => {
          console.log('Data intevalDate:', data);
          this.intevalDate = data;

          // Initialiser le calendrier
          this.initialiserFullCalendar();

          // Ajouter chaque intervalle comme un événement dans le calendrier
          this.intevalDate.forEach(interval => {
            this.calendar.addEvent({
              title: 'Indisponible',
              start: interval.debut,
              end: interval.fin,
              classNames: ['indisponible'],
              backgroundColor: 'grey',
              textColor: 'white',
              groupId:'indisponible'
            });
          });
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }


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

  getEmployes(serviceId:String): void {
    console.log(this.ApiUrl + 'services/getEmployesByCompetence/'+serviceId  );
    this.http.get(this.ApiUrl + 'services/getEmployesByCompetence/'+serviceId)
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
      this.getEmployes(params['id']);
    });
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