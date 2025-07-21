import { Component, OnInit , ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
  standalone:false
})
export class OtpPage implements OnInit {

 mobile = '';
  otp = '';
otp1 = '';
otp2 = '';
otp3 = '';
otp4 = '';
@ViewChild('otp1Input') otp1Input!: ElementRef;
@ViewChild('otp2Input') otp2Input!: ElementRef;
@ViewChild('otp3Input') otp3Input!: ElementRef;
@ViewChild('otp4Input') otp4Input!: ElementRef;
  constructor(private router: Router, private route: ActivatedRoute) { 
    //  this.route.queryParams.subscribe(params => {
    //   this.mobile = params['mobile'];
    // })
  }

  ngOnInit() {
     const navigation = this.router.getCurrentNavigation();
  this.mobile  = navigation?.extras?.state?.['mobile'];
  }

  onSubmitOtp() {
    if (this.otp.length === 6) {
      // Proceed to next page or dashboard
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  }
  verifyOtp() {


}
  goBack() {
    this.router.navigate(['/login']);
  }

resendOtp() {
  console.log('Resend OTP triggered');
}


onOtpKeyup(event: KeyboardEvent, position: number) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  if (value.length === 1 && position < 4) {
    this.focusInput(position + 1);
  } else if (event.key === 'Backspace' && !value && position > 1) {
    this.focusInput(position - 1);
  } else if (event.key === 'ArrowRight' && position < 4) {
    this.focusInput(position + 1);
  } else if (event.key === 'ArrowLeft' && position > 1) {
    this.focusInput(position - 1);
  }
}

focusInput(pos: number) {
  switch (pos) {
    case 1:
      this.otp1Input.nativeElement.focus();
      break;
    case 2:
      this.otp2Input.nativeElement.focus();
      break;
    case 3:
      this.otp3Input.nativeElement.focus();
      break;
    case 4:
      this.otp4Input.nativeElement.focus();
      break;
  }
}

}
