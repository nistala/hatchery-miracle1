import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { apis } from 'src/app/services/apis';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.page.html',
  styleUrls: ['./owner-dashboard.page.scss'],
  standalone: false,
})
export class OwnerDashboardPage implements OnInit {
  isSubmitting = false;
  checkinAccordionOpen = true;
  driverStatusDetails: any={};
  availableDriversList: any[] = [];
  checkedInDriversList: any[] = [];
  completedDriversList: any[] = [];
  roundsCompletedList: any[] = [];
  activeTab: 'available' | 'checkedIn' | 'completed' = 'available';
  moveToDriverCheckin = false;
  disableNewRoundButton = false;
  enableCompleteRoundButton: boolean = false;

  constructor(
    private router: Router,
    public apiService: ApiServiceService,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    // this.searchText = '';
    // this.currentSearchText = '';
    // this.offset = 0;
    // this.hasMoreData = true;
    this.getDriversStatusDetails();
  }
  async getDriversStatusDetails() {
    this.isSubmitting = true;
    const hatcheryId = await this.storage.get('hatcheryId')
    //console.log(userId);
    const url = `${apis.driversStatusDetails}?hatcheryId=${hatcheryId}`;

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
          this.driverStatusDetails = res;
          this.availableDriversList =
            this.driverStatusDetails.availableDrivers.filter(
              (d: any) => d.status === 'Available'
            );
          this.checkedInDriversList =
            this.driverStatusDetails.checkedInDrivers.filter(
              (d: any) => d.status === 'Check-In'
            );
          this.roundsCompletedList = this.driverStatusDetails.roundSummary;
          this.enableCompleteRoundButton = this.driverStatusDetails.currentRound === true? true : false;
          this.disableNewRoundButton = this.driverStatusDetails.completedRound === true? true : false;
        }
      },
      error: (err: any) => {
        console.error('Error fetching Driver Details:', err);
      },
    });
  }
  changeDriverStatus(value: any) {
    console.log('Change driver status clicked', value);
    const reqBody = {
      userId: value.id,
      vehicleNumber: value.vehicleNumber,
      hatcheryId: value.hatcheryId,
      ownerId: value.ownerId,
    };
    this.apiService
      .postApi(`${apis.driverCheckinFromAvailableList}`, reqBody)
      .subscribe((response) => {
        if (response.success === true) {
          this.presentToast('Checked-in successfully!', 'success');
          this.activeTab= 'checkedIn';
          this.getDriversStatusDetails();
          //this.router.navigate(['/tabs']);
          //console.log(response.success, '100');
        } else {
          this.presentToast(` ${value.driverName} We are unable to Checked-in !`, 'danger');
          alert('Unable to change driver status');
        }
      });
  }
  openRoundDetails(value:any) {
    console.log('Open round details dialog clicked', value);
    let roundNumber = value.match(/\d+/);
    this.router.navigate(['/tabs/rounds'], {
      queryParams: { round : roundNumber ? parseInt(roundNumber[0], 10) : null },
    });
  }

  async startNewRound (){
    //console.log(this.availableDriversList, 'Available Drivers List');

    if(this.availableDriversList.length !== 0) {
    const hatcheryId = await this.storage.get('hatcheryId')
    const url = `${apis.newRound}?hatcheryId=${hatcheryId}`
    this.apiService.postApi(url, {}).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res === null || res === undefined) {
          if (res.success !== true) {
            throw new Error('Failed to fetch driver details');
          } else if (!res) {
            throw new Error('No data found');
          }
        } else {
            if (res.success === false && res.message) {
            this.presentToast(res.message, 'danger');
            } else {
            this.presentToast('New round started successfully!', 'success');
            if(res.success === true) {
            this.enableCompleteRoundButton = true;
            this.disableNewRoundButton = true;
            this.moveToDriverCheckin = true;
            this.storage.set('moveToDriverCheckin',this.moveToDriverCheckin);
            }else{
            this.enableCompleteRoundButton = false;
            this.disableNewRoundButton = false;
             this.moveToDriverCheckin = false;
            this.storage.set('moveToDriverCheckin',this.moveToDriverCheckin);
            }
            this.getDriversStatusDetails();
            }
        }
      },
      error: (err: any) => {
        console.error('Error fetching Driver Details:', err);
      },
    });
    }
    if(this.availableDriversList.length !== 0) {
      this.router.navigate(['/tabs/checkin']);
      //this.presentToast('No drivers available for a new round', 'warning');
     // return;
    }else{
      this.moveToDriverCheckin = false;
      this.disableNewRoundButton = false;
    }

  }

  async completeCurrentRound(){
    const hatcheryId = await this.storage.get('hatcheryId')
    const checkinBoolean = sessionStorage.getItem('moveToDriverCheckin');

    const url = `${apis.completeCurrentRound}?hatcheryId=${hatcheryId}&round=${this.driverStatusDetails.latestRound}&flag=true`;
    this.apiService.putApi(url, {}).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res === null || res === undefined) {
          if (res.success !== true) {
            throw new Error('Failed to Update Completed Round details');
          } else if (!res) {
            throw new Error('No data found');
          }
        } else {
            if (res.success === false && res.message) {
            this.presentToast(res.message, 'danger');
            } else {
            this.presentToast('Successfully updated completed round!', 'success');
            this.disableNewRoundButton = false;
            this.enableCompleteRoundButton = true;
            sessionStorage.setItem('moveToDriverCheckin', 'true');
            this.moveToDriverCheckin = true;
            this.getDriversStatusDetails();
            }

        }
      },
      error: (err: any) => {
        console.error('Error fetching Driver Details:', err);
      },
    });
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
