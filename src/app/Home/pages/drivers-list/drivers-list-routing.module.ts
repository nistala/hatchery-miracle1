import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriversListPage } from './drivers-list.page';

const routes: Routes = [
  {
    path: '',
    component: DriversListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversListPageRoutingModule {}
