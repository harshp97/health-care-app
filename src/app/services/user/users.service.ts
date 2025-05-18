import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //baseUrl = 'http://localhost:8000/api/v1/users';
  baseUrl = 'https://backend103-1.onrender.com/api/v1/users';
  constructor(private http: HttpClient) { }

  //getcurrentUser
  getCurrentUser(): Observable<any> {
    const url = `${this.baseUrl}/getcurrentUser`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    return this.http.post<any>(url, {}, { headers: headers });
  }

  loginUser(logindetail: any) {

    const body = {
      // "username": "recipt",
      // "username": "johndoe1231a",
      //"password": "securepassword221"
    };

    const url = `${this.baseUrl}/login`;
    return this.http.post<any>(url, logindetail, { withCredentials: true });
  }

  checkInCookies() {

    // 1. Get the access token from local storage
    const refreshToken = localStorage.getItem('refreshToken');

    const requestBody = { refreshToken: refreshToken };

    const url = `${this.baseUrl}/checkInCookies`;
    return this.http.post<any>(url, requestBody, { withCredentials: true },);
  }


  logoutUser(): Observable<any> {
    const url = `${this.baseUrl}/logoutUser`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    return this.http.post<any>(url, {}, { headers: headers });
  }

}