import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { OwnerRegisterPageRoutingModule } from './owner-register-routing.module';
import { OwnerRegisterPage } from './owner-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OwnerRegisterPageRoutingModule
  ],
  declarations: [OwnerRegisterPage]
})
export class OwnerRegisterPageModule {}
