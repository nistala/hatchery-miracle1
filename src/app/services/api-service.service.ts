import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { apis } from './apis';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) { }

  getApi(endpoint: string): Observable<any> {
    return this.http.get(endpoint).pipe(
      map((uresponse: any) => {
        return uresponse;
      }),
      catchError(this.handleError<any>("Login"))
    );
  }
  deleteApi(endpoint: string): Observable<any> {
    return this.http.delete(endpoint).pipe(
      map((uresponse: any) => {
        return uresponse;
      }),
      catchError(this.handleError<any>("Login"))
    );
  }
  postApi(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(endpoint, data).pipe(
      map((uresponse: Response) => {
        return uresponse;
      }),
      catchError(this.handleError<any>("Login"))
    );
  }
  putApi(endpoint: string, data: any): Observable<any> {
    return this.http.put(endpoint, data).pipe(
      map((uresponse: any) => {
        return uresponse;
      }),
      catchError(this.handleError<any>("Login"))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error?.error?.status === 401 && error?.error?.message === 'Unauthorized') {

        this.router.navigate(['/']);
      }

      return of(result as T);
    };
  }

  showTailwindToast = async (message: any) => {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      cssClass: "toast-success"
    });
    toast.present();
  }
  
  // private apiUrl = 'http://172.17.12.28:9009/nafarm/states';
  // getStates(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  // getDistricts(stateId: string): Observable<any[]> {
  //   return this.http.get<any[]>(`http://172.17.12.28:9009/nafarm/districts?stateId=${stateId}`);
  // }
  // getBlocks(districtId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`http://172.17.12.28:9009/nafarm/blocks?districtId=${districtId}`);
  // }
  // getMandals(blockId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`http://172.17.12.28:9009/nafarm/mandals?blockId=${blockId}`);
  // }
  // getStatesInfo(): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getStatesInfo);
  // }
  // getDistrictsInfo(stateId: any): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getDistrictsInfo + stateId);
  // }
  // getBlocksInfo(districtId: any): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getBlocksInfo + districtId);
  // }
  // getMandalsInfo(blockId: any): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getMandalsInfo + blockId);
  // }
  // getPanchayatInfo(mandalId: any): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getPanchayatInfo + mandalId);
  // }
  // getVillageInfo(panchayatId: any): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getVillageInfo + panchayatId);
  // }
  // getHamletInfo(villageId: any): Observable<any[]> {
  //   return this.http.get<any[]>(apis.getHamletInfo + villageId);
  // }

}