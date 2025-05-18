import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientsService } from '../services/patient/patients.service';
import { SuccessComponent } from '../popup/success/success.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientRecordexistsComponent } from '../popup/patient-recordexists/patient-recordexists.component';
import { FailComponent } from '../popup/fail/fail.component';


@Component({
  selector: 'app-edit-patient',
  standalone: false,
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.css'
})
export class EditPatientComponent {
  myForm!: FormGroup;
  maxDate: Date;

  patientFormData: PatientData[] = [];
  displayedColumns = ['_id', 'name', 'mobileNumber', 'email', 'address', 'gender', 'dob', 'visitstatus'];

  patientEditForm!: FormGroup;
  // isHidden = true => Field is hidden.
  // isHidden = false => Field is shown.
  isHidden: boolean = true;
  isFormHidden: boolean = true;
  patientName: any;
  patient_id: any;

  isPEditFormLoading: boolean = false;
  isTableLoading: boolean = false;


  constructor(private fb: FormBuilder, private patientService: PatientsService,
    public dialog: MatDialog,
  ) {
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

    this.patientEditForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
      careOf: ['', [Validators.minLength(3)]],
      address: [''],

      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.email]],

      //only for doc
      pastHistory: [''],
      familyHistory: [''],
    });


    setTimeout(() => {
      this.checkforProfession();   // Show the field after 3 seconds
    }, 3000);

    this.getallPatientDetails();
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
          this.refreshData();
          alert("No Data Searched, something went wrong | contact ADMIN");
          break;
      }


      // const formValues = this.myForm.value;

    } else {
      // Trigger validation to show errors
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
    this.isTableLoading = true;// open loading
    this.patientService.searchPby_id(_id).subscribe({
      next: (response) => {
        this.patientFormData = response.data;
        this.isTableLoading = false;//close loading
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isTableLoading = false;//close loading

      }
    });
  }

  searchPbyname(name: any) {
    this.isTableLoading = true;//open loading
    this.patientService.searchPbyname(name).subscribe({
      next: (response) => {
        this.patientFormData = response.data;
        this.isTableLoading = false;//close loading
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isTableLoading = false;// close loading
      }
    });
  }

  searchPbymobileNumber(mobileNumber: any) {
    this.isTableLoading = true;//open loading
    this.patientService.searchPbymobileNumber(mobileNumber).subscribe({
      next: (response) => {
        this.patientFormData = response.data;
        this.isTableLoading = false;//close loading
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isTableLoading = false;//close loading
      }
    });
  }

  searchPbyemail(email: any) {
    this.isTableLoading = true;
    this.patientService.searchPbyemail(email).subscribe({
      next: (response) => {
        this.patientFormData = response.data;
        this.isTableLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isTableLoading = false;
      }
    });
  }

  searchPbydob(dob: any) {
    this.isTableLoading = true;

    this.patientService.searchPbydob(dob).subscribe({
      next: (response) => {
        this.patientFormData = response.data;
        this.isTableLoading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isTableLoading = false;
      }
    });
  }

  searchPby_visitstatus(visitstatus: any) {
    this.isTableLoading = true;
    this.patientService.searchPby_visitstatus(visitstatus)
      .subscribe({
        next: (response) => {
          this.patientFormData = response.data;
          this.isTableLoading = false;
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isTableLoading = false;
        }
      });
  }

  getallPatientDetails() {
    this.isTableLoading = true;// open loading
    this.patientService.getallPatientDetails().subscribe({
      next: (response) => {
        this.patientFormData = response.data;
        this.isTableLoading = false;// close loading
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isTableLoading = false;// close loading
      }
    })
  }


  clickedRows(row: any) {

    this.isFormHidden = false;

    this.patientName = row.name;
    this.patient_id = row._id;

    this.patientEditForm.get('_id')?.setValue(row._id);

    this.patientEditForm.get('name')?.setValue(row.name)
    this.patientEditForm.get('dob')?.setValue(row.dob)
    this.patientEditForm.get('gender')?.setValue(row.gender)
    this.patientEditForm.get('careOf')?.setValue(row.careOf)
    this.patientEditForm.get('address')?.setValue(row.address)
    this.patientEditForm.get('mobileNumber')?.setValue(row.mobileNumber)
    this.patientEditForm.get('email')?.setValue(row.email)
    this.patientEditForm.get('familyHistory')?.setValue(row.familyHistory)
    this.patientEditForm.get('pastHistory')?.setValue(row.pastHistory)

  }


  refreshData() {
    this.getallPatientDetails();
  }


  //for edit p form

  resetPatientForm(): void {
    this.patientEditForm.reset();
    Object.keys(this.patientEditForm.controls).forEach(key => {
      this.patientEditForm.get(key)?.setErrors(null);
    });
  }


  checkforProfession() {
    let profession = localStorage.getItem('profession');
    if (profession === "Doctor") {
      this.isHidden = false;
    }
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { 'invalidDate': true };
    }
    return null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.patientEditForm.get(controlName);

    if (control?.hasError('required')) {
      return 'You must enter a value';
    }

    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }

    if (control?.hasError('pattern')) {
      if (controlName === 'mobileNumber') {
        return 'Invalid mobile number (10 digits)';
      }
      return 'Invalid format'; // Generic pattern error
    }

    if (control?.hasError('email')) {
      return 'Not a valid email';
    }

    if (control?.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength}`;
    }

    if (control?.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }

    if (controlName === 'dob' && control?.hasError('invalidDate')) {
      return 'Date must be in the past';
    }

    return '';  // No error
  }

  submitNewPatientData() {
    if (this.patientEditForm.valid) {
      this.isPEditFormLoading = true; //open loading
      this.patientService.updatePatient(this.patientEditForm.value).subscribe({
        next: (response) => {
          this.isFormHidden = true;
          this.resetPatientForm();
          this.openSucess("Patient's Personal Information Updated Successfully.");
          this.isPEditFormLoading = false; //close loading
        },
        error: (error) => {
          this.isFormHidden = true;
          this.resetPatientForm();
          this.openFail("Failed to update.");
          this.isPEditFormLoading = false;//close loading
        }
      });
    }
    else {
      this.markAllAsTouched();
      this.resetPatientForm();
      this.isFormHidden = true;
      this.refreshData();  //reset table 
    }
  }

  openAccountDialog(data: any) {

    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '400px', // Adjust width as needed
      data: data // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // refresh patient table
      this.refreshData();  //reset table 
    });
  }

  openFailDialog(data: any) {
    const dialogRef = this.dialog.open(PatientRecordexistsComponent, {
      width: '400px', // Adjust width as needed
      data: data // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // refresh patient table
      this.resetPatientForm();
      this.isFormHidden = true;
      this.refreshData();  //reset table 
    });
  }


  markAllAsTouched() {
    Object.keys(this.patientEditForm.controls).forEach(controlName => {
      this.patientEditForm.get(controlName)?.markAsTouched();
    });
  }


  openSucess(msg: any) {

    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.resetForm();  //reset form 
    });
  }


  openFail(msg: any) {

    const dialogRef = this.dialog.open(FailComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.resetForm();  //reset form 
    });
  }




}

export interface PatientData {
  id: string;
  name: string;
  mobileNumber: number;
  email: string;
  address: string;
  gender: string;
  dob: string;
  visitstatus: string;

}
