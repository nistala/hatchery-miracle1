import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
// Keyboard.setAccessoryBarVisible({ isVisible: true });
import { ToastController } from '@ionic/angular';

function _window(): any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  get nativeWindow(): any {
    return _window();
  }

  constructor(private toastController: ToastController, private router: Router) { }

  onKeyPress(event: any) {

    const allowedChars = /[a-zA-Z\s]/; // Regular expression to match alphabetic characters and space

    // Check if the pressed key is an alphabetic character, a space, or a control key like Backspace or Delete
    if (!allowedChars.test(event.key) && !event.ctrlKey && event.key.length === 1) {
      // If the pressed key is not alphabetic, not a space, and not a control key, prevent default behavior (input of the character)
      event.preventDefault();
    }

  }
  //It allows only Numbers
  onlynumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '')
  }
  onlyNumbers(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    event.target.value = inputValue;
  }
  //It will not accept space in the beginning
  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }

  //It will restrict special character except , and .
  restrictSpecialCharacters(event: any) {
    var x = event.which || event.keyCode
    if ((x >= 97 && x <= 122) || (x >= 49 && x <= 57) || (x === 46) || (x === 44)) {
      return true
    }
    return false
  }
  //It will restrict 0 from starting
  restrictZero(event: any) {
    if (event.target.value.length === 0 && event.key === "0") {
      event.preventDefault()
    }
  }
  // It use to restrict dot
  dot(event: any) {
    if (event.keyCode === 190) {
      event.preventDefault()
    }
  }
  //This method allows max, mix chacters 
  maxData(data: any, maxletter: any, nxtData: any) {
    if (data.target.value.length > maxletter) {
      if (nxtData === "") {
        Keyboard.hide();
      } else {
        nxtData.setFocus();
      }
    }
  }
  //Restrict the numbers and starting spaces
  restrictNumber(event: any): void {
    let value: string = event.target.value;
    value = value
      .replace(/[0-9]/g, '')  // Remove any numeric characters
      .replace(/[^a-zA-Z\s'"`]/g, '')  // Allow only letters, spaces, apostrophes, double quotes and backticks
      .replace(/^\s+/, '')   // Remove any leading spaces
      .replace(/['"`]/g, '');  // Remove any single quotes, double quotes or backticks
    event.target.value = value;
  }

  //toast message
  showToast = async (message: any) => {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: "toast-success"
    });
    toast.present();
  }
  // method to get formarted indiannumbers for unit price
  formatIndianNumber(num: any) {
    if (num >= 100000) {
      // For numbers greater than or equal to 1,00,000, add comma separators after every 2 digits
      return num.toLocaleString('en-IN');
    } else if (num >= 1000) {
      // For numbers greater than or equal to 1,000 and less than 1,00,000, add comma separators after the first 1 or 2 digits, and then after every 2 digits
      const parts = num.toString().split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? '.' + parts[1].substring(0, 2) : '';
      if (integerPart.length <= 3) {
        return integerPart + decimalPart;
      } else if (integerPart.length === 4) {
        return integerPart.substring(0, 1) + ',' + integerPart.substring(1) + decimalPart;
      } else if (integerPart.length === 5) {
        return integerPart.substring(0, 2) + ',' + integerPart.substring(2) + decimalPart;
      }
    }
    else if (num < 1000) {
      const parts = num.toString().split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? '.' + parts[1].substring(0, 2) : '';
      if (integerPart.length <= 3) {
        return integerPart + decimalPart;
      }
    }
    else {
      // For numbers less than 1,000, simply return the number
      return num.toString();
    }
  }
  // removing spaces in search bar
  onKeyDownSpace(event: KeyboardEvent, searchData: string): void {
    if (event.key === ' ') {
      const input = event.target as HTMLInputElement;
      const currentCursorPosition = input.selectionStart ?? 0;

      if (
        currentCursorPosition === 0 ||
        searchData[currentCursorPosition - 1] === ' '
      ) {
        event.preventDefault();
      }
    }
  }
  onlyOneSpaceValidator(event: any) {
    const inputText = event.target.value;

    // Remove special characters and allow only letters, numbers, and single spaces
    const sanitizedText = inputText.replace(/^[ ]+/g, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s{2,}/g, ' ');

    if (sanitizedText !== inputText) {
      event.target.value = sanitizedText;
    }
  }
  showTailwindToast(message: string) {
    const toastElement = document.createElement('div');
    toastElement.className = `
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          bg-white  px-4 py-2 rounded-md shadow-md
          flex items-center gap-2 font-medium text-sm
          whitespace-nowrap animate-slide-in
        `;

    toastElement.innerHTML = `
        <div class="flex items-center rounded-md shadow-md bg-white">
          <div class="w-12 h-12 bg-[#22c55e] rounded-l-md flex items-center justify-center">
           
            <ion-icon name="checkmark" style="color: white; width: 50%; height: 50%;"></ion-icon>
          </div>
          <div class="px-4 py-2">
            <span class="text-base" style="color: black;">${message}</span>
          </div>
        </div>
      `;
    document.body.appendChild(toastElement);

    setTimeout(() => {
      toastElement.classList.add('animate-slide-out');
      setTimeout(() => {
        toastElement.remove();
      }, 300);
    }, 3000);
  }
  showTailwindToastforWarn(message: string) {
    const toastElement = document.createElement('div');
    toastElement.className = `
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          bg-white  px-4 py-2 rounded-md shadow-md
          flex items-center gap-2 font-medium text-sm
          whitespace-nowrap animate-slide-in
        `;

    toastElement.innerHTML = `
        <div class="flex items-center rounded-md shadow-md bg-white">
          <div class="w-12 h-12 bg-[#facc15] rounded-l-md flex items-center justify-center">
           
            <ion-icon name="warning-outline" style="color: white; width: 50%; height: 50%;"></ion-icon>
          </div>
          <div class="px-4 py-2">
            <span class="text-base" style="color: black;">${message}</span>
          </div>
        </div>
      `;
    document.body.appendChild(toastElement);

    setTimeout(() => {
      toastElement.classList.add('animate-slide-out');
      setTimeout(() => {
        toastElement.remove();
      }, 300);
    }, 3000);
  }

  showTailwindToastforError(message: string) {
    const toastElement = document.createElement('div');
    toastElement.className = `
          fixed top-4 left-1/2 transform -translate-x-1/2 z-50
          bg-white  px-4 py-2 rounded-md shadow-md
          flex items-center gap-2 font-medium text-sm
          whitespace-nowrap animate-slide-in
        `;

    toastElement.innerHTML = `
        <div class="flex items-center rounded-md shadow-md bg-white">
          <div class="w-12 h-12 bg-[#ef4444] rounded-l-md flex items-center justify-center">
           
            <ion-icon name="close-circle-outline" style="color: white; width: 50%; height: 50%;"></ion-icon>
          </div>
          <div class="px-4 py-2">
            <span class="text-base" style="color: black;">${message}</span>
          </div>
        </div>
      `;
    document.body.appendChild(toastElement);

    setTimeout(() => {
      toastElement.classList.add('animate-slide-out');
      setTimeout(() => {
        toastElement.remove();
      }, 300);
    }, 3000);
  }
}
