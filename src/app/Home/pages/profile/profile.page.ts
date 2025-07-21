import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  user: any= {}
  constructor( private router: Router, private storage: Storage) { }

  ngOnInit() {
  }
    ionViewWillEnter() {
  const profile = sessionStorage.getItem('userInfo');
  this.user = profile ? JSON.parse(profile) : this.user;
  console.log( this.user,"21");

  }

   logout() {
    this.router.navigate(['/login']);
    sessionStorage.clear();
    this.storage.clear();
  }

}
