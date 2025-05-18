import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PendingService {
  // baseUrl = 'http://localhost:8000/api/v1/pendings';
  baseUrl = 'https://backend103-1.onrender.com/api/v1/pendings';
  constructor(private http: HttpClient) { }


  savePending(pendingData: any): Observable<any> {
    const url = `${this.baseUrl}/savePending`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api
    return this.http.post<any>(url, pendingData, { headers: headers });
  }

  getPending_Pid(patient_id: any): Observable<any> {
    const url = `${this.baseUrl}/getPending_Pid`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { patient_id: patient_id };
    console.log(requestBody);


    //3. create req.body to pass with api
    return this.http.post<any>(url, requestBody, { headers: headers });
  }


  deletePending(_id: any): Observable<any> {
    const url = `${this.baseUrl}/deletePending`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // 3. Create request body to pass with API
    const requestBody = { _id: _id };

    // Return DELETE with body
    return this.http.delete<any>(url, { headers: headers, body: requestBody });
  }

}
