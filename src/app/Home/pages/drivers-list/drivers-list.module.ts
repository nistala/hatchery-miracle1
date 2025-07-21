import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriversListPageRoutingModule } from './drivers-list-routing.module';

import { DriversListPage } from './drivers-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriversListPageRoutingModule,
  ],
  declarations: [DriversListPage]
})
export class DriversListPageModule {}
