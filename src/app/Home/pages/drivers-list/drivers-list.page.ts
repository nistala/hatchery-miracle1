import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { apis } from 'src/app/services/apis';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.page.html',
  styleUrls: ['./drivers-list.page.scss'],
  standalone: false
})
export class DriversListPage implements OnInit {
searchTerm: string = '';
  isSubmitting:boolean = false;
  driversList:any[] = [];

  filteredDrivers : any[] = [];

  constructor(private router: Router, public apiService: ApiServiceService,private toastController: ToastController) {}

  ngOnInit() {}


  ionViewWillEnter() {
    this.getDriversList('');
  }
   getDriversList(searchTerm: string) {
    this.isSubmitting = true;
    const userId = sessionStorage.getItem('userId');
    const url = `${apis.driversList}?ownerId=${userId}&searchText=${searchTerm? searchTerm : ''}`;

    this.apiService.getApi(url).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res === null || res === undefined) {
          if (res.success !== true) {
            throw new Error('Failed to fetch driver details');
          } else if (!res) {
            throw new Error('No data found');
          }
        } else {
          this.driversList = res.data;
          console.log('Drivers fetched successfully:', this.driversList);

        }
      },
      error: (err: any) => {
        console.error('Error fetching Driver Details:', err);
      },
    });
  }
    filterDrivers() {
    const term = this.searchTerm.toLowerCase();
    this.getDriversList(term)
  }
}
