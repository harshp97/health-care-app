import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientsService } from '../services/patient/patients.service';
import { VisitsService } from '../services/visit/visits.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-search-patient',
  standalone: false,
  templateUrl: './search-patient.component.html',
  styleUrl: './search-patient.component.css'
})
export class SearchPatientComponent implements OnInit {
  myForm!: FormGroup;
  maxDate: Date;
  tableData: VisitData[] = [];
  dataSource = new MatTableDataSource<VisitData>(this.tableData);
  displayedColumns = ['weight', 'height', 'bloodSugar', 'bloodPressure', 'updatedAt', 'prescription', 'note', 'examinedby', 'followUpDate', 'CC', 'conclusion',];


  constructor(private fb: FormBuilder, private patientService: PatientsService, private visitService: VisitsService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      search: ['', [Validators.required]],
      _id: ['', [Validators.pattern('^[0-9a-z]{24}$')]],
      name: ['', [Validators.minLength(3)]],
      dob: [''],
      mobileNumber: ['', [Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.email]],
      visitstatus: ['',]
    });

  }

  onSubmit() {

    if (this.myForm.valid) {
      // You can send the data to an API or perform other actions here.

      switch (this.myForm.value.search) {
        case "_id":
          this.searchPby_id(this.myForm.value._id);
          console.warn("searchPby_id");

          break;

        case "name":
          this.searchPbyname(this.myForm.value.name);
          console.warn("searchPbyname");

          break;

        case "dob":
          this.searchPbydob(this.myForm.value.dob);
          console.warn("searchPbydob");

          break;

        case "mobileNumber":
          this.searchPbymobileNumber(this.myForm.value.mobileNumber);
          console.warn("searchPbymobileNumber", this.myForm.value.mobileNumber);

          break;

        case "email":
          this.searchPbyemail(this.myForm.value.email);
          console.warn("searchPbyemail");

          break;

        case "visitstatus":
          this.searchPby_visitstatus(this.myForm.value.visitstatus);
          console.warn("searchPbyvisitstatus");

          break;


        default:
          console.log("ERR from switch!");
          alert("No Data Searched, something went wrong | contact ADMIN");
          break;
      }


      // const formValues = this.myForm.value;

    } else {
      // Trigger validation to show errors
      console.log('ERR, re-enter ');
      this.resetForm();
    }
  }

  resetForm(): void {
    this.myForm.reset();
    Object.keys(this.myForm.controls).forEach(key => {
      this.myForm.get(key)?.setErrors(null);
    });
  }

  onSearchCriteriaChange(): void {
    // Clear all fields when dropdown changes
    this.myForm.patchValue({
      _id: null,
      name: null,
      dob: null,
      mobileNumber: null,
      email: null,
      visitstatus: null,
    });

  }


  showField(fieldName: string): boolean {
    return this.myForm.get('search')?.value === fieldName;
  }

  searchPby_id(_id: any) {
    this.patientService.searchPby_id(_id)
      .subscribe({
        next: (response) => {
          console.log('API Response of patient based on _id :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

  searchPbyname(name: any) {
    this.patientService.searchPbyname(name)
      .subscribe({
        next: (response) => {
          console.log('API Response of patient based on name :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

  searchPbymobileNumber(mobileNumber: any) {
    this.patientService.searchPbymobileNumber(mobileNumber)
      .subscribe({
        next: (response) => {
          console.log('API Response of patient based on mobileNumber :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

  searchPbyemail(email: any) {
    this.patientService.searchPbyemail(email)
      .subscribe({
        next: (response) => {
          console.log('API Response of patient based on email :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

  searchPbydob(dob: any) {
    console.log("\n DOB", dob);

    this.patientService.searchPbydob(dob)
      .subscribe({
        next: (response) => {
          console.log('API Response of patient based on dob :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

  searchPby_visitstatus(visitstatus: any) {
    console.log("\n DOB", visitstatus);
    this.patientService.searchPby_visitstatus(visitstatus)
      .subscribe({
        next: (response) => {
          console.log('API Response of patient based on visitstatus :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
        },
        error: (error) => {
          console.error('API Error:', error);
        }
      });
  }

}

export interface VisitData {
  weight: number;
  height: number;
  bloodSugar: number;
  bloodPressure: string;
  updatedAt: string;

  prescription: string;
  note: string;
  examinedby: string;
  followUpDate: string;
  CC: string;
  conclusion: string;
}
