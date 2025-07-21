import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerRegisterPage } from './owner-register.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRegisterPageRoutingModule {}
