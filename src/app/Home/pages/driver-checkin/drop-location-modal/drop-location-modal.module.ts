import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DropLocationModalPageRoutingModule } from './drop-location-modal-routing.module';

import { DropLocationModalPage } from './drop-location-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DropLocationModalPageRoutingModule,
    DropLocationModalPage
  ]
})
export class DropLocationModalPageModule {}
