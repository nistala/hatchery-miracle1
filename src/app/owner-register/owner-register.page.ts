import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiServiceService } from '../services/api-service.service';
import { apis } from 'src/app/services/apis';

@Component({
  selector: 'app-owner-register',
  templateUrl: './owner-register.page.html',
  styleUrls: ['./owner-register.page.scss'],
  standalone: false
})
export class OwnerRegisterPage implements OnInit {
  ownerRegisterForm!: FormGroup;
  constructor(private fb: FormBuilder,private router: Router, private apiService: ApiServiceService,private toastController: ToastController) {}

  ngOnInit() {
    this.ownerRegisterForm = this.fb.group({
      ownerName: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      vehicleNumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  registerOwner() {
    if (this.ownerRegisterForm.valid) {
      const formData = this.ownerRegisterForm.value;
      const reqBody = {
    "ownerName": formData.ownerName,
    "phoneNumber": formData.phoneNumber,
    "vehicleNumber": formData.vehicleNumber,
    "hatcheryId": 1,
    "role": "OWNER",
    "password": formData.password
    }
          console.log('Request Body:', reqBody);
          this.apiService.postApi(`${apis.ownerRegister}`, reqBody).subscribe((response) => {
            if (response.success === true) {
               this.presentToast('Owner Registration successful!', 'success');
              this.router.navigate(['/owner-login']);
            } else {
                 this.presentToast("Failed To Register!","danger")
            }
          })
  }
  }

  onInputLimit(event: any, field: string) {
    const value = event.target.value;
    if (value.length > 50) {
      this.ownerRegisterForm.get(field)?.setValue(value.substring(0, 50));
    }
  }

  onPhoneInput(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    this.ownerRegisterForm.get('phoneNumber')?.setValue(input);
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
