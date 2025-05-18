import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LogoutserviceService {

  constructor() { }

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  setLoginStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  getLoginStatus(): boolean {
    return this.isLoggedInSubject.value;
  }

}
