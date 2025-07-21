import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerLoginPage } from './owner-login.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerLoginPageRoutingModule {}
