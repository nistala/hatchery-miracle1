import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { apis } from 'src/app/services/apis';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-driver-registration',
  templateUrl: './driver-registration.page.html',
  styleUrls: ['./driver-registration.page.scss'],
  standalone: false,
})
export class DriverRegistrationPage implements OnInit {
  driverRegisterForm!: FormGroup;
  ownerRegisterForm!: FormGroup;
  driver: any = {
    fullName: '',
    ownerName: '',
    phone: '',
    truckType: '',
    licenseNumber: '',
    vehicleNumber: '',
  };
  truckTypes: string[] = [
    'Ape Xtra LDX',
    'Bolero Pik-Up 4x2',
    'Bolero Pik-Up ExtraStrong',
    'Bolero Maxitruck Plus',
    'DCM 4-wheeler',
    'DCM Toyota HT',
    'DCM 909',
    'Tata 407 EX',
    'Tata 407 Pickup',
    'Tata 407 Gold SFC',
    'Tata 1109 EX',
    'Tata 1120 LPT',
    'Tata Ace Gold',
  ];
  ownerList: any[] = [];
  phoneAlreadyExists: boolean = false;
 // selectedTab: 'driver' | 'owner' = 'driver';
 selectedTab = 'owner';
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private toastController: ToastController,
     private storage: Storage
  ) {}

  ngOnInit() {
    this.initFarmerForm();
    this.getownerList();
  }

  initFarmerForm() {
    this.driverRegisterForm = this.formBuilder.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(35),
        ],
      ],
      ownerName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(35),
        ],
      ],
      phone: ['', [Validators.required, this.phoneNumberValidator()]],
      truckType: ['', Validators.required],
      licenseNumber: ['', Validators.required, Validators.pattern(/^[0-9]+$/)],
      vehicleNumber: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)],
      ],
    });

    this.ownerRegisterForm = this.formBuilder.group({
      ownerName: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[6-9]\\d{9}$')],
      ],
      ownerAddress: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  getownerList() {
    this.apiService.getApi(`${apis.ownerList}`).subscribe((response) => {
      this.ownerList = response.owners;
    });
  }
  async registerDriver() {
    const hatcheryId = await this.storage.get('hatcheryId')
    const formData = this.driverRegisterForm?.value;
   // console.log('Registering driver:', this.driver);
    const reqBody = {
      driverName: formData?.fullName,
      ownerName: formData?.ownerName.ownerName,
      phoneNumber: formData?.phone?.replace(/\D/g, ''),
      licenseNumber: formData?.licenseNumber,
      vehicleNumber: formData?.vehicleNumber,
      vehicleType: formData?.truckType,
      ownerId: formData?.ownerName.id,
      hatcheryId: hatcheryId,
      role: 'DRIVER',
    };
    console.log('Request Body:', reqBody);
    this.apiService
      .postApi(`${apis.driverRegister}`, reqBody)
      .subscribe((response) => {
        if (response.success === true) {
          this.presentToast('Driver Registration successful!', 'success');
          this.router.navigate(['/tabs']);
          this.driver = {};
        } else {
          this.presentToast('Failed To Register!', 'danger');
        }
      });
  }
  async registerOwner() {
     const hatcheryId = await this.storage.get('hatcheryId')
    if (this.ownerRegisterForm.valid) {
      const formData = this.ownerRegisterForm.value;
      const reqBody = {
        ownerName: formData.ownerName,
        phoneNumber: formData.phoneNumber,
        hatcheryId: hatcheryId,
        role: 'OWNER',
        address: formData.ownerAddress,
      };
      this.apiService
        .postApi(`${apis.ownerRegister}`, reqBody)
        .subscribe((response) => {
          if (response.success === true) {
            this.presentToast('Owner Registration successful!', 'success');
            this.router.navigate(['/tabs/home']);
          } else {
            this.presentToast('Failed To Register!', 'danger');
          }
        });
    }
  }
  onPhoneInput(event: any) {
    let input = event.target.value.replace(/\D/g, '').slice(0, 12); // Max 12 digits
    let formatted = input;
    if (input.length === 10) {
      formatted = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6)}`;
    } else if (input.length > 8) {
      formatted = `${input.slice(0, 4)}-${input.slice(4, 8)}-${input.slice(8)}`;
    } else if (input.length > 4) {
      formatted = `${input.slice(0, 4)}-${input.slice(4)}`;
    }
    const control = this.driverRegisterForm.get('phone');
    control?.setValue(formatted, { emitEvent: false });
    // 👇 Force immediate validation
    control?.markAsTouched();
    control?.updateValueAndValidity({ onlySelf: true });
    this.phoneAlreadyExists = false;
  }
  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.replace(/\D/g, '');
      if (!value) return null;
      if (value.length !== 10) {
        return { lengthInvalid: true };
      }
      if (!/^[6-9]/.test(value)) {
        return { startsWithInvalid: true };
      }
      return null;
    };
  }
  onInputLimit(event: any, formValue: any): void {
    const input = event.target.value || '';
    const filtered = input.replace(/[^A-Za-z]/g, ''); // Allow only letters
    const control = this.driverRegisterForm.get(formValue);
    if (input !== filtered) {
      event.target.value = filtered;
    }
    // Update form control
    control?.setValue(filtered, { emitEvent: false });
    // Show error if length reached
    if (filtered.length >= 35) {
      control?.markAsTouched();
      control?.updateValueAndValidity();
    }
  }
  onInputNumberLimit(event: any, formValue: any): void {
    const input = event.target.value || '';
    const filtered = input.replace(/[^A-Za-z0-9]/g, ''); // Allow only letters
    const control = this.driverRegisterForm.get(formValue);
    if (input !== filtered) {
      event.target.value = filtered;
    }
    // Update form control
    control?.setValue(filtered, { emitEvent: false });
    // Show error if length reached
    if (filtered.length >= 35) {
      control?.markAsTouched();
      control?.updateValueAndValidity();
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // visible for 3 seconds
      color, // 'success', 'danger', 'warning', etc.
      position: 'bottom',
    });
    await toast.present();
  }
}
