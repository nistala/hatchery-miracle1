import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverCheckinPage } from './driver-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: DriverCheckinPage
  },  {
    path: 'drop-location-modal',
    loadChildren: () => import('./drop-location-modal/drop-location-modal.module').then( m => m.DropLocationModalPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverCheckinPageRoutingModule {}
