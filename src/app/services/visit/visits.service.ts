import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  //baseUrl = 'http://localhost:8000/api/v1/visits';
  baseUrl = 'https://backend103.onrender.com/api/v1/visits';
  constructor(private http: HttpClient) { }


  //Save Patient (Permanent)
  saveVisitData_R(visitData: any): Observable<any> {
    const url = `${this.baseUrl}/saveNewVisit_R`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api

    return this.http.post<any>(url, visitData, { headers: headers });
  }


  //Save Patient (Permanent)
  saveVisitData_D(visitData: any): Observable<any> {
    const url = `${this.baseUrl}/saveNewVisit_D`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api

    return this.http.post<any>(url, visitData, { headers: headers });
  }


  //getallVisitDetails_byPatientID
  getallVisitDetails_byPatientID(patientId: any): Observable<any> {
    const url = `${this.baseUrl}/getallVisitDetails_byPatientID`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { patientId: patientId };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  saveVisitData_Examine(visitData: any): Observable<any> {
    const url = `${this.baseUrl}/saveVisitData_Examine`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api

    return this.http.post<any>(url, visitData, { headers: headers });
  }


  // after saving patient status and new visit data only 4 fields,, w,h,bp,sug are added
  saveNewVisitFour_R(visitData: any): Observable<any> {
    const url = `${this.baseUrl}/saveNewVisitFour_R`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api

    return this.http.post<any>(url, visitData, { headers: headers });
  }

  deleteVisit(_id: any): Observable<any> {
    const url = `${this.baseUrl}/deleteVisit`;

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

  //get visit data based on visit id
  getVisitDetails_byVisitID(_id: any): Observable<any> {
    const url = `${this.baseUrl}/getVisitDetails_byVisitID`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { _id: _id };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  //update visit
  updateVisit(visitUData: any): Observable<any> {
    const url = `${this.baseUrl}/updateVisit`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api
    return this.http.post<any>(url, visitUData, { headers: headers });
  }



}
