import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { config } from 'src/app/config/config';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-manager',
  templateUrl: './home-manager.component.html',
  styleUrls: ['./home-manager.component.css']
})
export class HomeManagerComponent implements OnInit, OnDestroy {
  depenseParMois: any = [];
  chiffreAffaire: any = [];
  beneficeParMois: any = [];
  nbReservation: any = [];
  annee: string =  new Date().getFullYear() + '';
  mois: string = new Date().getMonth( )+ 1 +'';

  private chiffreAffaireChart: Chart;
  private beneficeParMoisChart: Chart;
  private depenseParMoisChart: Chart;
  private nbReservationChart: Chart;
  @ViewChild('chiffreAffaireChart') chiffreAffaireChartCanvas: ElementRef;
  @ViewChild('beneficeParMoisChart') beneficeParMoisChartCanvas: ElementRef;
  @ViewChild('depenseParMoisChart') depenseParMoisChartCanvas: ElementRef;
  @ViewChild('nbReservationChart') nbReservationChartCanvas: ElementRef;

  public barChartMonthLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  currentYear = new Date().getFullYear();
  startYear = 2010;

  isLoadingChiffreAffaire: boolean = true;
  isLoadingDepense: boolean = true;
  isLoadingBenefice: boolean = true;
  isLoadingReservation: boolean = true;

  public years = Array.from({ length: this.currentYear - this.startYear + 1 }, (_, index) => (this.startYear + index).toString());

  public months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  constructor(private http: HttpClient) { }

  generateRandomColor(): string {
    const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
    return randomColor;
  }

  getDepenseParMois(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get(config.apiUrl + 'statistiques/depenseParMois/annee=' + this.annee)
        .subscribe(
          (data) => {
            console.log('Data:', data);
            this.depenseParMois = data;
            console.log(this.depenseParMois);
            resolve(); // Résoudre la Promise après la réception des données
          },
          (error) => {
            console.error('Error:', error);
            reject(error); // Rejeter la Promise en cas d'erreur
          }
        );
    });
  }

  filtreChiffreAffaire(mois, annee) {
    this.mois = mois;
    this.annee = annee;
    console.log( 'this.mois' + this.mois);
    console.log( 'this.annee' + this.annee);
    this.getChiffreAffaire().then(() => {
      this.renderChiffreAffaireChart();
    });

    this.getDepenseParMois().then(() => {
      console.log("Après getDepenseParMois");
      this.renderDepenseParMois();
    });

    this.getBeneficeParMois().then(() => {
      this.renderBeneficeParMoisChart();
    });

    this.getNbReservation().then(() => {
      this.renderNbReservationChart();
    });
  }

  getChiffreAffaire() {
    return new Promise<void>((resolve, reject) => {
      this.http.get(config.apiUrl + 'statistiques/chiffresAffaire/mois=' + this.mois + '/annee=' + this.annee)
        .subscribe(
          (data) => {
            console.log('Data:', data);
            this.chiffreAffaire = data;
            resolve(); // Résoudre la Promise après la réception des données
          },
          (error) => {
            console.error('Error:', error);
            reject(error); // Rejeter la Promise en cas d'erreur
          }
        );
    });
  }

  getBeneficeParMois() {
    return new Promise<void>((resolve, reject) => {
      this.http.get(config.apiUrl + 'statistiques/beneficeParMois/annee=' + this.annee)
        .subscribe(
          (data) => {
            console.log('Data:', data);
            this.beneficeParMois = data;
            resolve(); // Résoudre la Promise après la réception des données
          },
          (error) => {
            console.error('Error:', error);
            reject(error); // Rejeter la Promise en cas d'erreur
          }
        );
    });
  }

  getNbReservation() {
    console.log(this.mois);
    console.log(this.annee);
    return new Promise<void>((resolve, reject) => {
      this.http.get(config.apiUrl + 'statistiques/countReservation/mois=' + this.mois + '/annee=' + this.annee)
        .subscribe(
          (data) => {
            console.log('Data:', data);
            this.nbReservation = data;
            resolve(); // Résoudre la Promise après la réception des données
          },
          (error) => {
            console.error('Error:', error);
            reject(error); // Rejeter la Promise en cas d'erreur
          }
        );
    });
  }

  renderPieChart() {
    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };
    new Chart("pieChart", {
      type: 'pie',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderDepenseParMois() {
    if (this.depenseParMoisChart) {
      this.depenseParMoisChart.destroy();
    }

    console.log(this.depenseParMois);
    console.log("hellooo");
    const labels = this.depenseParMois.map(entry => {
      const monthInfo = this.months.find(month => month.value === entry.mois);
      return monthInfo ? monthInfo.label : entry.mois;
    });

    const colors = this.generateRandomColor();

    const totals = this.depenseParMois.map(entry => entry.totalDepense);

    console.log('labelsD : ', labels);
    console.log('totalsD : ', totals);
    this.depenseParMoisChart = new Chart(this.depenseParMoisChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Dépense',
          data: totals,
          borderWidth: 1,
          backgroundColor: colors,
          borderColor: colors
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // renderBarChart() {
  //   const data = {
  //     labels: 'Mois',
  //     datasets: [{
  //       label: 'My First Dataset',
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //         'rgba(255, 205, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(201, 203, 207, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(255, 159, 64)',
  //         'rgb(255, 205, 86)',
  //         'rgb(75, 192, 192)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(201, 203, 207)'
  //       ],
  //       borderWidth: 1
  //     }]
  //   };

  //   const config = {
  //     type: 'bar',
  //     data: data,
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     },
  //   };

  //   new Chart("barChart", 
  //     config );

    

  // }

  renderChiffreAffaireChart() {
    // Détruisez le graphique existant s'il y en a un
    if (this.chiffreAffaireChart) {
      this.chiffreAffaireChart.destroy();
    }

    let labels;

    if(this.mois === '0') {
      console.log('!this.mois');
      labels = this.chiffreAffaire.map(entry => {
        const monthInfo = this.months.find(month => month.value === entry.mois);
        return monthInfo ? monthInfo.label : entry.mois;
      });
    }
    else {
      labels = this.chiffreAffaire.map(entry => entry.jour);
    }

    const colors = this.generateRandomColor();
    
    const totals = this.chiffreAffaire.map(entry => entry.totalDepense);

    console.log('labelsC : ', labels);
    console.log('totalsC : ', totals);

    // Créez le nouveau graphique en utilisant la référence au canvas
    this.chiffreAffaireChart = new Chart(this.chiffreAffaireChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Recette',
          data: totals,
          borderWidth: 1,
          backgroundColor: colors,
          borderColor: colors
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderBeneficeParMoisChart() {
    // Détruisez le graphique existant s'il y en a un
    if (this.beneficeParMoisChart) {
      this.beneficeParMoisChart.destroy();
    }

    const labels = this.beneficeParMois.map(entry => {
      const monthInfo = this.months.find(month => month.value === entry.mois);
      return monthInfo ? monthInfo.label : entry.mois;
    });

    const colors = this.generateRandomColor();
    
    const totals = this.beneficeParMois.map(entry => entry.totalBenefice);

    console.log('labelsB : ', labels);
    console.log('totalsB : ', totals);

    // Créez le nouveau graphique en utilisant la référence au canvas
    this.beneficeParMoisChart = new Chart(this.beneficeParMoisChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Bénéfice',
          data: totals,
          borderWidth: 1,
          backgroundColor: colors,
          borderColor: colors
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderNbReservationChart() {
    // Détruisez le graphique existant s'il y en a un
    if (this.nbReservationChart) {
      this.nbReservationChart.destroy();
    }

    let labels;

    if(this.mois === '0') {
      console.log('!this.mois');
      labels = this.nbReservation.map(entry => {
        const monthInfo = this.months.find(month => month.value === entry.mois);
        return monthInfo ? monthInfo.label : entry.mois;
      });
    }
    else {
      labels = this.nbReservation.map(entry => entry.jour);
    }

    const colors = this.generateRandomColor();
    
    const totals = this.nbReservation.map(entry => entry.count);

    console.log('labelsR : ', labels);
    console.log('totalsR : ', totals);

    // Créez le nouveau graphique en utilisant la référence au canvas
    this.nbReservationChart = new Chart(this.nbReservationChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de réservations',
          data: totals,
          borderWidth: 1,
          backgroundColor: colors,
          borderColor: colors
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }



  ngOnInit(): void {
    console.log("Home Manager");
    this.getChiffreAffaire().then(
      () => {
        this.renderChiffreAffaireChart();
      },
      () => {
        // Handle rejection if needed
        console.log("Error");
      }
    ).then(() => {
      this.isLoadingChiffreAffaire = false;
    });
    
    this.getDepenseParMois().then(
      () => {
        console.log("Après getDepenseParMois");
        this.renderDepenseParMois();
      },
      () => {
        // Handle rejection if needed
        console.log("Error");
      }
    ).then(() => {
      this.isLoadingDepense = false;
    });
  
    this.getBeneficeParMois().then(
      () => {
        this.renderBeneficeParMoisChart();
      },
      () => {
        // Handle rejection if needed
        console.log("Error");
      }
    ).then(() => {
      this.isLoadingBenefice = false;
    });
  
    this.getNbReservation().then(
      () => {
        this.renderNbReservationChart();
      },
      () => {
        // Handle rejection if needed
        console.log("Error");
      }
    ).then(() => {
      this.isLoadingReservation = false;
    });
    
  }

  ngOnDestroy(): void {
    // Détruisez le graphique lorsqu'il n'est plus nécessaire (par exemple, lorsque le composant est détruit)
    if (this.chiffreAffaireChart) {
      this.chiffreAffaireChart.destroy();
    }

    if (this.beneficeParMoisChart) {
      this.beneficeParMoisChart.destroy();
    }

    if (this.depenseParMoisChart) {
      this.depenseParMoisChart.destroy();
    }

    if (this.nbReservationChart) {
      this.nbReservationChart.destroy();
    }
  }

}
