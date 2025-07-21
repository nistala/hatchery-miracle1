import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoundDetailsPage } from './round-details.page';

const routes: Routes = [
  {
    path: '',
    component: RoundDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoundDetailsPageRoutingModule {}
