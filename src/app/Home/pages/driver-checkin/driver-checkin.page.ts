import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { apis } from 'src/app/services/apis';
import { ModalController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DropLocationModalPage } from './drop-location-modal/drop-location-modal.page';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-driver-checkin',
  templateUrl: './driver-checkin.page.html',
  standalone: false,
})
export class DriverCheckinPage {
  searchTerm: string = '';
  isSubmitting: boolean = false;
  driversList: any[] = [];
  dropLoactions: any[] = [
    'Gantyada',
    'Poosapatirega',
    'Denkada',
    'Bhogapuram',
    'Srungavarapukota',
    'Jami',
    'Vepada',
    'Lakkavarapukota',
    'Kothavalasa',
    'Bondapalli',
  ];
  driversStatus: boolean = false;
  filteredDrivers: any[] = [];
  availableCount: number = 0;
  skipDriver: boolean = false;

  constructor(
    public modalController: ModalController,
    private router: Router,
    public apiService: ApiServiceService,
    private toastController: ToastController,
    private alertController: AlertController,
     private storage: Storage
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    console.log('ionViewDidEnter called');
    this.getDriversList('');
    const checkinBoolean = sessionStorage.getItem('moveToDriverCheckin');
    console.log('Checkin Boolean:', checkinBoolean);
    if (checkinBoolean === 'true' || checkinBoolean === null) {
      this.driversStatus = true;
    } else if( checkinBoolean === 'false') {
      this.driversStatus = false;
    }
    sessionStorage.setItem('moveToDriverCheckin',this.driversStatus.toString());
  }
  async getDriversList(searchTerm: string) {
    this.isSubmitting = true;
   const hatcheryId = await this.storage.get('hatcheryId')
    const url = `${
      apis.availableDriversListForCheckIn
    }?hatcheryId=${hatcheryId}&searchText=${searchTerm ? searchTerm : ''}`;

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
          this.driversList = res.availableDrivers || [];
          this.availableCount = res.availableCount || 0;
          if(this.driversList.length === 0) {
             sessionStorage.setItem('moveToDriverCheckin', 'false');
          }
          console.log('Drivers fetched successfully:', this.driversList);
        }
      },
      error: (err: any) => {
        console.error('Error fetching Driver Details:', err);
      },
    });
  }

  async changeDriverStatus(driver: any) {
    const modal = await this.modalController.create({
      component: DropLocationModalPage,
      componentProps: {
        dropLocations: this.dropLoactions,
      },
      breakpoints: [0, 0.25, 0.5], // define sheet heights
      initialBreakpoint: 0.25, // open at 25% of screen height
      cssClass: 'bottom-sheet-modal', // optional styling
      backdropDismiss: true,
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        console.log('Input value:', res.data);
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.selectedLocation) {
      console.log(driver, 'Driver Details');

      const reqBody = {
        userId: driver.id,
        vehicleNumber: driver.vehicleNumber,
        hatcheryId: driver.hatcheryId === null ?1: driver.hatcheryId,
        ownerId: driver.ownerId,
        dropLocation: data.selectedLocation,
        skipReason: data.skipReason || '',
      };

      this.apiService
        .postApi(`${apis.driverCheckinFromAvailableList}`, reqBody)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.presentToast('Checked-in successfully!', 'success');
              this.getDriversList('');
            } else {
              this.presentToast(
                `${driver.driverName}: Unable to check-in.`,
                'danger'
              );
            }
          },
          error: () => {
            this.presentToast('Network error. Please try again.', 'danger');
          },
        });
    }
  }

  filterDrivers() {
    const term = this.searchTerm.toLowerCase();
    this.getDriversList(term);
  }
  skipDriverCurrentRound(driver: any) {
    this.alertController
      .create({
        header: `Select a reason to skip ${driver.driverName}`,
        inputs: [
          {
            type: 'radio',
            label: 'Driver unavailable',
            value: 'Driver unavailable',
            checked: true,
          },
          {
            type: 'radio',
            label: 'Vehicle issue',
            value: 'Vehicle issue',
          },
          {
            type: 'radio',
            label: 'Personal request',
            value: 'Personal request',
          },
          {
            type: 'radio',
            label: 'Other',
            value: 'Other',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Skip',
            cssClass: 'primary',
            handler: (data) => {
              console.log(
                `Skipping driver ${driver.driverName} for reason: ${data}`
              );
              this.skipDriver = true;
              if (data !== '') {
                const reqBody = {
                  userId: driver.id,
                  vehicleNumber: driver.vehicleNumber,
                  hatcheryId: driver.hatcheryId,
                  ownerId: driver.ownerId,
                  dropLocation: data.selectedLocation,
                  skipReason: data || '',
                  status: 'skip',
                };
                console.log('Request Body:', reqBody);

                this.apiService
                  .postApi(`${apis.driverCheckinFromAvailableList}`, reqBody)
                  .subscribe({
                    next: (response) => {
                      if (response.success) {
                        this.presentToast(
                          'Checked-in successfully!',
                          'success'
                        );
                        this.getDriversList('');
                      } else {
                        this.presentToast(
                          `${driver.driverName}: Unable to check-in.`,
                          'danger'
                        );
                      }
                    },
                    error: () => {
                      this.presentToast(
                        'Network error. Please try again.',
                        'danger'
                      );
                    },
                  });
              }
              // Your skip logic here
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // visible for 3 seconds
      color, // 'success', 'danger', 'warning', etc.
      position: 'bottom',
    });
    await toast.present();
  }
}
