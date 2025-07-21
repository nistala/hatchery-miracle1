import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverCheckinPageRoutingModule } from './driver-checkin-routing.module';

import { DriverCheckinPage } from './driver-checkin.page';
import { DropLocationModalPage } from './drop-location-modal/drop-location-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverCheckinPageRoutingModule,DropLocationModalPage
  ],
  declarations: [DriverCheckinPage]
})
export class DriverCheckinPageModule {}
