import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showTabs = true;
  path: any = window.location.href;
  constructor(private router: Router, private storage: Storage, private platform: Platform) {
    this.router.events
      .pipe(filter((event:any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.path = event.urlAfterRedirects;
      });
      this.initializeApp();
    // this.platform.ready().then(() => {
    //   // Set keyboard mode to resize the body, so content moves up
    //   Keyboard.setResizeMode({ mode: KeyboardResize.Body });
    // });
  }

  async initializeApp() {
  await this.platform.ready();
  await this.storage.create();
  const isLoggedIn = await this.storage.get('isLoggedIn');
  console.log(isLoggedIn);
   const userId = await this.storage.get('userId')
    console.log(userId);
  if (isLoggedIn) {
    this.router.navigate(['/tabs']); // or your dashboard page
  } else {
    this.router.navigate(['/login']);
  }
}
}
