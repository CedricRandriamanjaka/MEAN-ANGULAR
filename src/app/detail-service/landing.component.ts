import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Draggable } from '@fullcalendar/interaction';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { IAlert } from '../sections/alerts-section/alerts-section.component'; // Importez l'interface IAlert


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
  fav: any;
  competences: any = [];
  viewDate: Date = new Date();

  intevalDate: any;
  calendar: any;
  @ViewChild('external') external: ElementRef;
  showCalendar: boolean = false;

  nouvelIntervalDebut: any;
  currentEmpID: any;

  public alerts: Array<IAlert> = [];
    private backup: Array<IAlert>;

    // Fonction pour fermer une alerte
    close(alert: IAlert) {
      this.alerts.splice(this.alerts.indexOf(alert), 0);
  }

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private http: HttpClient, private cookieService: CookieService) { }
  // readonly ApiUrl = "http://localhost:3000/api/";
  readonly ApiUrl = "https://mean-m1-1-vten.onrender.com/api/";
  

  private initialiserFullCalendar() {
    var now = new Date();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();
    var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, currentMinute);
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, currentHour, currentMinute);
    var calendarEl = document.getElementById('calendar');

    new Draggable(this.external.nativeElement, {
      itemSelector: '.fc-event',
      eventData: (eventEl) => {
        return {
          title: eventEl.innerText,
          duration: { minutes: this.service.duree },
          timeZone: 'UTC',
        };
      }
    });

    this.calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      slotDuration: '00:30:00',
      slotLabelInterval: { hours: 1 },
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek'
      },
      nowIndicator: true,
      height: 'auto',
      validRange: {
        start: startDate,
        end: endDate
      },
      timeZone: 'UTC',
      editable: true,
      droppable: true,
      eventOverlap: false,
      drop: (dropInfo) => {
        this.nouvelIntervalDebut = new Date(dropInfo.date.getTime() - 3 * 60 * 60 * 1000);
        dropInfo.draggedEl.parentNode.removeChild(dropInfo.draggedEl);
      },
      eventDrop: (eventDropInfo) => {
        const event = eventDropInfo.event;
        const newStart = new Date(event.start.getTime() - 3 * 60 * 60 * 1000);
        this.nouvelIntervalDebut = newStart;
      }
    });
    this.calendar.render();
  }

  getIndispoDate(employeID) {
    this.currentEmpID = employeID;
    this.http.get<any[]>(this.ApiUrl + 'utilisateur/getIndispoDate/' + employeID + '/' + this.service._id)
      .subscribe(
        (data) => {
          this.intevalDate = data;
          this.initialiserFullCalendar();
          this.intevalDate.forEach(interval => {
            this.calendar.addEvent({
              title: 'Indisponible',
              start: interval.debut,
              end: interval.fin,
              classNames: ['indisponible'],
              backgroundColor: 'grey',
              textColor: 'white',
              groupId: 'indisponible'
            });
          });
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    this.showCalendar = true;
  }

  getService(serviceId: String) {
    this.http.get(this.ApiUrl + 'services/' + serviceId)
      .subscribe(
        (data) => {
          this.service = data;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  getEmployes(serviceId: String): void {
    this.http.get(this.ApiUrl + 'services/getEmployesByCompetence/' + serviceId)
      .subscribe(
        (data) => {
          this.employes = data;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  getFav(): void {
    const userId = this.cookieService.get('userId');
    
    this.http.get(this.ApiUrl + 'favori/utilisateur/' + userId)
      .subscribe(
        (data: any[]) => {
          this.fav = data.filter(favorite => this.employes.some(employee => employee.id === favorite.id));
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
    this.getFav();
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

  public confirmeRDV() {
    if (this.nouvelIntervalDebut) {
      const dateToSend = moment(this.nouvelIntervalDebut).toISOString();
      this.http.post<any>(`${this.ApiUrl}rendezVous/ajouterRDV/${this.cookieService.get('userId')}/${this.currentEmpID}/${this.service._id}/${dateToSend}`, {})
        .subscribe(
          (data) => {
            // alert(data);
            this.alerts.unshift({
              id: 0,
              type: 'success',
              strong: 'reussit' + '! ',
              message: 'votre rendez vous e ete enregistre pour le '+dateToSend,
              icon: 'ni ni-like-2'
          });
          },
          (error) => {
            this.alerts.unshift({
              id: 0,
              type: 'error',
              strong: 'erreur' + '! ',
              message: 'une erreur s est produit lors du prise de rendez vous , ne vous inquiete pas, aucun payement n as ete realise',
              icon: 'ni ni-support-16'
          });
            console.error('Erreur lors de l\'ajout du rendez-vous :', error);
          }
        );
    } else {
      console.warn('L\'heure de début du nouvel intervalle n\'est pas définie.');
    }
  }
}