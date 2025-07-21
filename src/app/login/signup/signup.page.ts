import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { Router } from '@angular/router';
import { ValidationsService } from 'src/app/services/validations.service';
import { apis } from 'src/app/services/apis';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  registrationForm!: FormGroup;
  actualAadhaar: string = '';
  showFullAadhaar: boolean = false;
  showPassword: boolean = false;
  phoneAlreadyExists: boolean = false;
  aadhaarExists = false;
  states: any[] = [];
  districts: any[] = [];
  blocks: any[] = [];
  mandals: any[] = [];
  panchayats: any[] = [];
  villages: any[] = [];
  hamlets: any[] = [];
  mandalList: any[] = [];
  panchayatList: any[] = [];
  villageList: any[] = [];
  hamletList: any[] = [];
  stateList: any[] = [];
  districtList: any[] = [];
  blockList: any[] = [];
  displayedAadhaar: string = '';

  constructor(
    private toastController: ToastController,
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiServiceService,
    private validations: ValidationsService,
  ) { }

  ngOnInit() {
    // Step 1: Initialize form
    this.registrationForm = this.fb.group({
      role: ['buyer'],
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
      aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
      password: ['', [Validators.required, Validators.maxLength(15), passwordValidator]],
      gender: ['male', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      constituency: ['', Validators.required],
      mandal: ['', Validators.required],
      panchayat: ['', Validators.required],
      village: ['', Validators.required],
      hamlet: [''],
      address: ['', [Validators.required, Validators.maxLength(250)]],
      email: ['', [Validators.required, Validators.email, strictEmailValidator]],
      confirmPassword: ['', Validators.required],
      // ... other fields
    }, {
      validators: this.matchPasswords('password', 'confirmPassword')
    });
    this.getStatesInfo(true);
    this.getStateList();
  };

  onLocationChange(level: string, event: any) {
    const value = event.detail.value;

    switch (level) {
      case 'state':
        this.registrationForm.patchValue({
          district: null, constituency: null, mandal: null, panchayat: null, village: null, hamlet: null
        });
        this.blockList = [];
        this.mandalList = [];
        this.panchayatList = [];
        this.villageList = [];
        this.hamletList = [];
        if (value) this.getDistrictsList(value);
        break;

      case 'district':
        this.registrationForm.patchValue({
          constituency: null, mandal: null, panchayat: null, village: null, hamlet: null
        });
        this.blockList = [];
        this.mandalList = [];
        this.panchayatList = [];
        this.villageList = [];
        this.hamletList = [];
        if (value) this.getBlocksList(value);
        break;

      case 'constituency':
        this.registrationForm.patchValue({
          mandal: null, panchayat: null, village: null, hamlet: null
        });
        this.panchayatList = [];
        this.villageList = [];
        this.hamletList = [];
        if (value) this.getMandalsList(value);
        break;

      case 'mandal':
        this.registrationForm.patchValue({
          panchayat: null, village: null, hamlet: null
        });
        this.panchayatList = [];
        this.villageList = [];
        this.hamletList = [];
        if (value) this.getPanchayatData(value);
        break;

      case 'panchayat':
        this.registrationForm.patchValue({
          village: null, hamlet: null
        });
        this.villageList = [];
        this.hamletList = [];
        if (value) {
          this.getVillageData(value);
          this.getHamletData(value);
        }
        break;
    }
  };

  // Form field getter
  get formControls() {
    return this.registrationForm.controls;
  }
  // Password strength errors
  get passwordStrength() {
    const errors = this.formControls['password'].errors;
    return errors?.['passwordStrength'] || {
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
      isValidLength: false
    };
  }


  // Limit firstName input to letters only
  onInputLimitname(event: any): void {
    const input = event.target.value || '';
    const filtered = input.replace(/[^A-Za-z]/g, ''); // Allow only letters
    const control = this.registrationForm.get('firstName');
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


  // Limit max 30 characters in general text input
  onInputLimit(event: any, controlName: string) {
    let input = event.target.value || '';
    input = input.replace(/[^A-Za-z ]/g, '');    // Only letters and space
    input = input.replace(/\s{2,}/g, ' ');       // Replace multiple spaces with single
    input = input.trimStart();                   // Remove leading space
    this.registrationForm.get(controlName)?.setValue(input, { emitEvent: false });
    this.registrationForm.get(controlName)?.markAsTouched();
    this.registrationForm.get(controlName)?.updateValueAndValidity({ onlySelf: true });
  };

  onAadhaarInput(event: any) {
    const rawInput = event.target.value || '';
    this.actualAadhaar = rawInput?.replace(/\D/g, '').slice(0, 12); // only digits, max 12
    this.registrationForm.get('aadhaarNumber')?.setValue(this.actualAadhaar, { emitEvent: true });
  };
  get maskedAadhaar(): string {
    if (this.showFullAadhaar || this.actualAadhaar.length < 12) {
      return this.formatAadhaar(this.actualAadhaar);
    }
    // Mask all but last 4 digits
    const last4 = this.actualAadhaar.slice(-4);
    return 'XXXX XXXX ' + last4;
  };
  formatAadhaar(aadhaar: string): string {
    return aadhaar?.replace(/(\d{4})(?=\d)/g, '$1 ').trim(); // formats as 1234 5678 9012
  };

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

    const control = this.registrationForm.get('phoneNumber');
    control?.setValue(formatted, { emitEvent: false });

    // 👇 Force immediate validation
    control?.markAsTouched();
    control?.updateValueAndValidity({ onlySelf: true });

    this.phoneAlreadyExists = false;

    setTimeout(() => {
      this.phoneExists();
    }, 0);
  };

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
  };

  phoneExists() {
    const control = this.registrationForm?.get('phoneNumber');
    const phone = control?.value?.replace(/\D/g, '');
    // Clear previous "exists" error
    const currentErrors = control?.errors;
    if (currentErrors && currentErrors['exists']) {
      delete currentErrors['exists'];
      control?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
    }
    // Accept only 10 or 12 digit numbers
    if ((phone && phone.length === 10) || phone.length === 12) {
      this.apiService.getApi(`${apis.checkMobileNumber}${phone}`)
        .subscribe({
          next: (res: any) => {
            if (res.userExists) {
              control?.setErrors({ ...control.errors, exists: true });
              control?.markAsTouched();
            }
          },
          error: (err) => {
            console.error('Error checking phone number', err);
          }
        });
    }
  }


  checkAadhaarExists() {
    const control = this.registrationForm.get('aadhaarNumber');
    const aadhaar = control?.value;
    if (aadhaar && aadhaar.length === 12) {
      this.apiService.getApi(`${apis.checkaadharExist}${aadhaar}`).subscribe({
        next: (res: any) => {
          this.aadhaarExists = res.AadhaarExist === true;
          if (this.aadhaarExists) {
            control?.setErrors({ aadhaarExists: true });
          } else {
            const errors = control?.errors;
            if (errors) {
              delete errors['exists'];
              control?.setErrors(Object.keys(errors).length ? errors : null);
            }
          }
        },
        error: (err) => {
          console.error('Aadhaar check failed', err);
          this.aadhaarExists = false;
        },
      });
    }
  };
  onPasswordInput(event: any) {
    const value = event.target.value;
    this.registrationForm.get('password')?.setValue(value);
    this.registrationForm.get('password')?.markAsTouched();
    this.registrationForm.get('password')?.updateValueAndValidity();
  };
  // Allow only 10 digit numbers for phone
  allowOnlyDigits(event: any) {
    const input = event.target.value;
    const filtered = input.replace(/[^0-9]/g, '').slice(0, 10);
    this.registrationForm.get('phone')?.setValue(filtered, { emitEvent: false });
  };
  maxData(data: any, maxletter: any, nxtData: any) {
    return this.validations.maxData(data, maxletter, nxtData)
  };

  // Handle form submission
  submitForm() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      // Submit logic here
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  // Get States Information
  getStatesInfo(isInitialLoad: boolean) {
    this.apiService.getStatesInfo().subscribe((states: any) => {
      this.states = states;
      this.resetFormsBasedOnIndex(0);
      this.registrationForm.get('state')?.setValue(this.states.filter(x => x.stateId == '1')[0].stateId);
      this.getDistrictsInfo(this.registrationForm.get('state')?.value, true);
    });
  }

  // Reset Forms Based on Index
  resetFormsBasedOnIndex(index: number) {
    const formControls = [
      'district',
      'block',
      'mandal',
      'panchayat',
      'village',
      'hamlet'
    ];
    for (let i = index; i < formControls.length; i++) {
      this.registrationForm.get(formControls[i])?.reset();
    }
  }

  onStateChange(event: any) {
    this.getDistrictsInfo(event.detail.value, false);
  }

  getDistrictsInfo(state: any, isInitialLoad: boolean) {
    this.apiService.getDistrictsInfo(state).subscribe((districts: any) => {
      this.districts = districts;
      this.resetFormsBasedOnIndex(1);
      if (isInitialLoad) {
        this.registrationForm.get('district')?.setValue(this.districts.filter(x => x.districtId == 17)[0].districtId);
        this.getBlocksInfo(this.registrationForm.get('district')?.value, true);
      }
    });
  }

  // Get Blocks Information based on District
  onDistrictChange(event: any) {
    this.resetFormsBasedOnIndex(2);
    this.getBlocksInfo(event.detail.value, false);
  }

  // Get Blocks Information api call
  getBlocksInfo(districtId: any, isInitialLoad: boolean) {
    this.apiService.getBlocksInfo(districtId).subscribe((blocks: any) => {
      this.blocks = blocks;
    });
  }

  // Get Mandals Information based on Block
  onBlockChange(event: any) {
    this.resetFormsBasedOnIndex(3);
    this.getMandalInfo(event.detail.value, false);
  }

  // Get Mandals Information api call
  getMandalInfo(blockId: any, isInitialLoad: boolean) {
    this.apiService.getMandalsInfo(blockId).subscribe((mandals: any) => {
      this.mandals = mandals;
    });
  }

  // Get panchayat Information based on Block
  onMandalChange(event: any) {
    this.resetFormsBasedOnIndex(4);
    this.getPanchayatInfo(event.detail.value, false);
  }

  getPanchayatInfo(mandalId: any, isInitialLoad: boolean) {
    this.apiService.getPanchayatInfo(mandalId).subscribe((panchayats: any) => {
      this.panchayats = panchayats;
    });
  }

  onPanchayatChange(event: any) {
    this.resetFormsBasedOnIndex(5);
    this.getVillageInfo(event.detail.value, false);
  }

  getVillageInfo(panchayatId: any, isInitialLoad: boolean) {
    this.apiService.getVillageInfo(panchayatId).subscribe((villages: any) => {
      this.villages = villages;
    });
  }
  onVillageChange(event: any) {
    this.getHamletInfo(event.detail.value, false);
  }
  getHamletInfo(villageId: any, isInitialLoad: boolean) {
    this.apiService.getHamletInfo(villageId).subscribe((hamlets: any) => {
      this.hamlets = hamlets;
    });
  }

  imageFiles: File[] = [];
  imagePreviewUrls: { url: string | ArrayBuffer | null; name: string }[] = [];

  onFarmerImagesSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      Array.from(target.files).forEach((file: File) => {
        const alreadyAdded = this.imageFiles.some(f => f.name === file.name);
        if (!alreadyAdded) {
          this.imageFiles.push(file);

          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreviewUrls.push({
              url: reader.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        } else {
          console.warn(`Duplicate image skipped: ${file.name}`);
        }
      });
      // Reset input so same file can be selected again after removal
      target.value = '';
    }
  }

  removeImage(index: number) {
    this.imageFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }
  goBack() {
    this.router.navigate(['/login']);
  }

  getPanchayatData(data: any) {
    this.apiService.getApi(`${apis.getPanchayatInfo}${data}`).subscribe({
      next: (res) => {
        const data = res || [];
        this.panchayatList = data
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  };
  getVillageData(data: any) {
    this.apiService.getApi(`${apis.getVillageInfo}${data}`).subscribe({
      next: (res) => {
        const data = res || [];
        this.villageList = data
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  };
  getHamletData(data: any) {
    this.apiService.getApi(`${apis.getHamletInfo}${data}`).subscribe({
      next: (res) => {
        const data = res || [];
        this.hamletList = data
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  };
  getStateList() {
    this.apiService.getApi(apis.getStatesInfo).subscribe((res: any) => {
      this.stateList = res || [];
      const defaultState = this.stateList.find((state: any) => state.label === 'Andhra Pradesh');
      if (defaultState) {
        this.registrationForm.patchValue({ state: defaultState.stateId });
        this.getDistrictsList(defaultState.stateId);
      }
    });
  };

  getDistrictsList(stateId: string) {
    this.apiService.getApi(`${apis.getDistrictsInfo}${stateId}`).subscribe((res: any) => {
      this.districtList = res || [];
      const defaultDistrict = this.districtList.find((dist: any) => dist.districtName === 'Vizianagaram');
      if (defaultDistrict) {
        this.registrationForm.patchValue({ district: defaultDistrict.districtId });
        this.getBlocksList(defaultDistrict.districtId);
      }
    });
  };

  getBlocksList(districtId: string) {
    this.apiService.getApi(`${apis.getBlocksInfo}${districtId}`).subscribe({
      next: (res) => {
        const data = res || [];
        this.blockList = data;
        const defaultconstituency = this.blockList.find((block: any) => block.blockName === 'Nellimarla'); const defaultBlock = this.blockList.find((block: any) => block.blockName === 'Nellimarla');
        if (defaultconstituency) {
          this.registrationForm.patchValue({ constituency: defaultconstituency.id });
          this.getMandalsList(defaultconstituency.id);
        }
      },
      error: (err) => {
        console.error('Error fetching blocks:', err);
      }
    });
  };

  getMandalsList(data: any) {
    this.apiService.getApi(`${apis.getMandalsInfo}${data}`).subscribe({
      next: (res) => {
        const data = res || [];
        this.mandalList = data
        console.log('✌️mandalList --->', this.mandalList);
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  };

  onCancel() {
    this.registrationForm.reset();
    this.showFullAadhaar = false;
    this.actualAadhaar = '';
    this.ngOnInit();
  };

  submitRegistrationForm() {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;

      const payload = {
        lkUserType: "BR",
        roleId: 8,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        aadhaarNo: formValue.aadhaarNumber,
        mobilePhone: (formValue.phoneNumber ?? '').replace(/\D/g, '').slice(0, 10),
        password: formValue.password,
        lkGender: formValue.gender === 'male' ? 'm' : 'f',
        state: formValue.state,
        district: formValue.district,
        block: formValue.constituency,
        mandal: formValue.mandal,
        panchayat: formValue.panchayat,
        village: formValue.village,
        hamlet: formValue.hamlet,
        address: formValue.address,
        email: formValue.email
      };
      this.apiService.postApi(`${apis.registrationDetail}`, payload)
        .subscribe({
          next: (res: any) => {
            this.validations.showTailwindToast('Registration successful!');
            this.router.navigate(['/login']);
            this.registrationForm.reset();
          },
          error: (err) => {
            this.validations.showTailwindToastforError('Registration failed. Please try again.');
          }
        });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  };

  onEmailInput(event: any) {
    const value = (event.target.value || '').trim();
    this.registrationForm.get('email')?.setValue(value, { emitEvent: false });
  };

  async showTailwindToast(message: string, cssClass: string = 'custom-success') {
    const toast = await this.toastController.create({
      message,
      duration: 10000,
      cssClass,
      position: 'middle'
    });
    await toast.present();
  }
  matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordKey)?.value;
      const confirmPassword = formGroup.get(confirmPasswordKey)?.value;
      if (password !== confirmPassword) {
        formGroup.get(confirmPasswordKey)?.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        const errors = formGroup.get(confirmPasswordKey)?.errors;
        if (errors) {
          delete errors['mismatch'];
          if (Object.keys(errors).length === 0) {
            formGroup.get(confirmPasswordKey)?.setErrors(null);
          }
        }
        return null;
      }
    };
  }
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValidLength = value.length >= 8;

  const valid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && isValidLength;

  return valid
    ? null
    : {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasDigit,
        hasSpecialChar,
        isValidLength,
      },
    };

}
export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value || '';
  const strictPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return strictPattern.test(email) ? null : { invalidEmail: true };
}

