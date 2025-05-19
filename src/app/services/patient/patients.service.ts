import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  //baseUrl = 'http://localhost:8000/api/v1/patients';
  baseUrl = 'https://backend103.onrender.com/api/v1/patients';
  constructor(private http: HttpClient) { }


  //Save Patient Recipt only (Permanent)
  savePatientData_R(patientData: any): Observable<any> {
    const url = `${this.baseUrl}/saveNewPatient_R`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api

    return this.http.post<any>(url, patientData, { headers: headers });
  }


  //Save Patient Doctor only (Permanent)
  savePatientData_D(patientData: any): Observable<any> {
    const url = `${this.baseUrl}/saveNewPatient_D`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api
    return this.http.post<any>(url, patientData, { headers: headers });
  }

  getallPatientDetails() {
    const url = `${this.baseUrl}/getallPatientDetails`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api
    return this.http.post<any>(url, {}, { headers: headers });
  }

  //get patient based on _id (search patient compo.)
  searchPby_id(_id: any): Observable<any> {
    const url = `${this.baseUrl}/searchPby_id`;

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

  //get patient based on name (search patient compo.)
  searchPbyname(name: any): Observable<any> {
    const url = `${this.baseUrl}/searchPbyname`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { name: name };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  searchPbymobileNumber(mobileNumber: any): Observable<any> {
    const url = `${this.baseUrl}/searchPbymobileNumber`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { mobileNumber: mobileNumber };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  searchPbyemail(email: any): Observable<any> {
    const url = `${this.baseUrl}/searchPbyemail`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { email: email };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  searchPbydob(dob: any): Observable<any> {
    const url = `${this.baseUrl}/searchPbydob`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { dob: dob };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  //basically just updated patient's visit status
  updatePatient_status(patientUData: any): Observable<any> {
    const url = `${this.baseUrl}/updatePatient_status`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api
    return this.http.post<any>(url, patientUData, { headers: headers });
  }

  searchPby_visitstatus(visitstatus: any): Observable<any> {
    const url = `${this.baseUrl}/searchPby_visitstatus`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    // Create a JSON object to send
    const requestBody = { visitstatus: visitstatus };

    return this.http.post<any>(url, requestBody, { headers: headers });
  }

  deletePatient(_id: any): Observable<any> {
    const url = `${this.baseUrl}/deletePatient`;

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

  updatePatient(patientUData: any): Observable<any> {
    const url = `${this.baseUrl}/updatePatient`;

    // 1. Get the access token from local storage
    const accessToken = localStorage.getItem('accessToken');

    // 2. Create the Authorization header with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`  // Add the "Bearer " prefix
    });

    //3. create req.body to pass with api
    return this.http.post<any>(url, patientUData, { headers: headers });
  }


}
