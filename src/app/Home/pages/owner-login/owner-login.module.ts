import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnerLoginPageRoutingModule } from './owner-login-routing.module';

import { OwnerLoginPage } from './owner-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OwnerLoginPageRoutingModule
  ],
  declarations: [OwnerLoginPage]
})
export class OwnerLoginPageModule {}
