import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { apis } from 'src/app/services/apis';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-owner-login',
  templateUrl: './owner-login.page.html',
  styleUrls: ['./owner-login.page.scss'],
   standalone: false
})
export class OwnerLoginPage implements OnInit {
  username = '';
  password = '';
  showPassword = true;
  constructor(private router: Router,private apiService: ApiServiceService,private toastController: ToastController, private storage: Storage) { 
     this.storage.create();
  }

  ngOnInit() {
  }
   async login() {
    const reqBody = {
      ownerName: this.username,
      password: this.password
    };
    this.apiService.postApi(`${apis.ownerLogin}`, reqBody).subscribe(async (response:any) => {
      console.log('Login response:', response);

      if (response.success === true) {
        sessionStorage.setItem("userId", response.userId);
        sessionStorage.setItem("userInfo", JSON.stringify(response));
        await this.storage.set('isLoggedIn', true);
        await this.storage.set("userId", response.userId);
        await this.storage.set("userInfo", JSON.stringify(response));
        this.presentToast("Login successful!","success")
        this.router.navigate(['/tabs']);
      } else {
          this.presentToast("Invalid credentials!","danger")
      }
    })
  }


async presentToast(message: string, color: string = 'success') {
  const toast = await this.toastController.create({
    message,
    duration: 3000,           // visible for 3 seconds
    color,                    // 'success', 'danger', 'warning', etc.
    position: 'bottom'
  });
  await toast.present();
}

}

