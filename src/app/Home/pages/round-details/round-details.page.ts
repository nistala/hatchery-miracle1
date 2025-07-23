import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { apis } from 'src/app/services/apis';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-round-details',
  templateUrl: './round-details.page.html',
  styleUrls: ['./round-details.page.scss'],
  standalone: false,
})
export class RoundDetailsPage implements OnInit {
  searchTerm: string = '';
  isSubmitting: boolean = false;
  roundDetailList: any[] = [];
  roundId= 0;
  completedCount = 0;
  roundDate = '';
  startTime = '';
  endTime = '';
  filteredDrivers: any[] = [];

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    public apiService: ApiServiceService,
    private toastController: ToastController,
    private storage: Storage
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.aroute.queryParams.subscribe((params) => {
      if (params['round']) {
          this.roundId = params['round'];
        this.getRoundDetails(params['round'],'');
      } else {
        console.error('No round parameter found in query params');
      }
    });
  }
  async getRoundDetails(roundId: number, searchTerm: string) {
    this.isSubmitting = true;
    const hatcheryId = await this.storage.get('hatcheryId')
    const url = `${apis.roundwiseDriverDetails}?round=${roundId}&hatcheryId=${hatcheryId}&search=${searchTerm? searchTerm : ''}`;

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
          this.completedCount = res.completedCount;
            this.startTime = res.roundStartTime
            this.endTime = res.roundEndTime
          this.roundDetailList = res.completedDrivers;
          this.roundId = res.round;
        }
      },
      error: (err: any) => {
        console.error('Error fetching Driver Details:', err);
      },
    });
  }
  filterDrivers() {
    const term = this.searchTerm.toLowerCase();
    this.getRoundDetails(this.roundId,term)
  }
}
