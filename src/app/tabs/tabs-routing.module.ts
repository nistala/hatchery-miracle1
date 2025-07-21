import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
  children: [
      {
        path: 'home',
        loadChildren: () => import('../Home/pages/owner-dashboard/owner-dashboard.module').then(m => m.OwnerDashboardPageModule)
      },
      {
        path: 'checkin',
        loadChildren: () => import('../Home/pages/driver-checkin/driver-checkin.module').then(m => m.DriverCheckinPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../Home/pages/driver-registration/driver-registration.module').then(m => m.DriverRegistrationPageModule)
      },
      {
        path: 'drivers-list',
        loadChildren: () => import('../Home/pages/drivers-list/drivers-list.module').then(m => m.DriversListPageModule)
      },{
        path: 'profile',
        loadChildren: () => import('../Home/pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'rounds',
        loadChildren: () => import('../Home/pages/round-details/round-details.module').then(m => m.RoundDetailsPageModule)
      },
       {
        path: '',
        redirectTo: '/tabs/home',  // 👈 Default route when /tabs is accessed
        pathMatch: 'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
