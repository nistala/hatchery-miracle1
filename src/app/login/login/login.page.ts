import { Component, OnInit } from '@angular/core';
// import { ApiServiceService } from 'src/app/services/api-service.service';
// import { AlertController } from '@ionic/angular';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { apis } from 'src/app/services/apis';
// import { ValidationsService } from 'src/app/services/validations.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  // loginForm: FormGroup | any;
  // isEnglish = true
  // showMobileInput = false;
  // showContinueButton = false;
  // showPasswordField = false;
  // showPassword: boolean = false;
  // showPasswordInput: boolean = false
  constructor() {
  }

  ngOnInit() {
    // this.loginForm = this.fb.group({
    //   mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    //   // mobile: [''],
    //   password: ['']
    // });
    // this.loginForm.reset();
  }
  // phoneExists() {
  //   const control = this.loginForm?.get('mobile');
  //   const phone = control?.value?.replace(/\D/g, '');

  //   const currentErrors = { ...control?.errors };
  //   delete currentErrors['exists'];
  //   delete currentErrors['notExists'];
  //   control?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);

  //   // if ((phone && phone.length === 10) || phone.length === 12) {
  //   //   this.apiService.getApi(`${apis.checkMobileNumber}${phone}`)
  //   //     .subscribe({
  //   //       next: (res: any) => {
  //   //         if (res.userExists === true) {
  //   //           control?.setErrors({ ...control.errors, exists: true });
  //   //         } else if (res.userExists === false) {
  //   //           control?.setErrors({ ...control.errors, notExists: true });
  //   //         }
  //   //         control?.markAsTouched();
  //   //       },
  //   //       error: (err) => {
  //   //         console.error('Error checking phone number', err);
  //   //       }
  //   //     });
  //   // }
  // }

  // onLoginPh() {
  //   this.showMobileInput = true;
  //   if (this.showPasswordInput === true) {
  //     this.showMobileInput = false;
  //     this.onLoginWithPassword();
  //   }
  // };

  // onLoginWithOTP() {
  //   if (this.loginForm.valid) {
  //     const mobile = this.loginForm.value.mobile;
  //     this.router.navigate(['/otp'], {
  //       state: { mobile }
  //     });
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //   }
  // }

  // onMobileInputChange() {
  //   this.showContinueButton = this.loginForm.valid;
  // }
  // async showAlert(message: string) {
  //   const alert = await this.alertController.create({
  //     header: 'Login Failed',
  //     message: message,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  // }

  // onLoginWithPassword() {
  //   const reqBody = {
  //     mobilePhone: this.loginForm.value.mobile,
  //     password: this.loginForm.value.password
  //   }
  //   this.apiService.postApi(apis.ownerLogin, reqBody).subscribe({

  //     next: (response) => {
  //       if (response?.success === true) {
  //         sessionStorage.setItem("userId", response.userId);
  //         this.loginForm.reset();
  //         this.showMobileInput = false;
  //         this.showPasswordInput = false;
  //         this.validations.showTailwindToast("Login Successful")
  //         this.router.navigate(['/home']);
  //       }
  //       else if (response?.success === false) {
  //         this.validations.showTailwindToastforError(response?.message);
  //       } 
  //       else {
  //         const errorMessage = response?.message || 'Something went wrong. Please try again.';
  //         this.validations.showTailwindToastforError(errorMessage);
  //       }
  //     },
  //     error: (error) => {
  //       const backendMessage = error?.error?.message || 'Server error occurred';
  //       this.showAlert(backendMessage);
  //     }
  //   });
  // }


  // onSelectPasswordLogin() {
  //   this.showMobileInput = false
  //   this.showPasswordField = true;
  //   this.showPasswordInput = true;
  //   this.showContinueButton = false;
  // }
  // togglePasswordVisibility() {
  //   this.showPassword = !this.showPassword;
  // }

  // onsignup() {
  //   this.router.navigate(['/signup']);
  // }

  // //It allows only Numbers
  // onlynumbers(event: any) {
  //   return this.validations.onlynumbers(event)

  // }
}