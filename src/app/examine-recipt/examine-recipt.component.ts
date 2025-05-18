import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientsService } from '../services/patient/patients.service';
import { VisitsService } from '../services/visit/visits.service';
import { PendingService } from '../services/pending/pending.service';
import { ExistingReciptVisitComponent } from '../popup/existing-recipt-visit/existing-recipt-visit.component';
import { ExistingReciptAlreadyexistComponent } from '../popup/existing-recipt-alreadyexist/existing-recipt-alreadyexist.component';
import { RecordNotsaveComponent } from '../popup/record-notsave/record-notsave.component';
import { WarningComponent } from '../popup/warning/warning.component';
import { FailComponent } from '../popup/fail/fail.component';
import { SuccessComponent } from '../popup/success/success.component';


@Component({
  selector: 'app-examine-recipt',
  standalone: false,
  templateUrl: './examine-recipt.component.html',
  styleUrl: './examine-recipt.component.css'
})
export class ExamineReciptComponent implements OnInit {

  myForm!: FormGroup;
  isLoading: boolean = false;


  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ExistingReciptVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public patientdata: any,      // Data passed from the parent component
    public dialog: MatDialog,
    private patientsService: PatientsService, private visitsService: VisitsService, private pendingService: PendingService) {

  }


  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: [this.patientdata.name, [Validators.required, Validators.minLength(3)]],
      dob: [this.patientdata.dob, [Validators.required, this.dateValidator]],
      gender: [this.patientdata.gender, [Validators.required]],
      careOf: [this.patientdata.careOf, [Validators.minLength(3)]],
      address: [this.patientdata.address],

      mobileNumber: [this.patientdata.mobileNumber, [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: [this.patientdata.email, [Validators.email]],


      weight: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.max(160)]],
      height: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.max(250)]],
      bloodSugar: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4), Validators.max(1000)]],
      bloodPressure: [''],


      //entered by doctor
      // pastHistory: [this.patientdata.pastHistory],
      // familyHistory: [this.patientdata.familyHistory],

      // prescription: ['', [Validators.required]],
      // cc: [''],
      // note: [''],
      // followUpDate: ['', [Validators.required, this.followdateValidator]],
      // conclusion: [''],

    });

    this.disablePatientData();
  }

  disablePatientData() {
    this.myForm.get('name')?.disable();
    this.myForm.get('dob')?.disable();
    this.myForm.get('gender')?.disable();
    this.myForm.get('careOf')?.disable();
    this.myForm.get('address')?.disable();
    this.myForm.get('mobileNumber')?.disable();
    this.myForm.get('email')?.disable();
    // this.myForm.get('pastHistory')?.disable();
    // this.myForm.get('familyHistory')?.disable();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { 'invalidDate': true };
    }
    return null;
  }

  followdateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      return { 'invalidDate': true };
    }
    return null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.myForm.get(controlName);

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
      if (controlName === 'weight') {
        return 'Invalid weight (numbers only)';
      }
      if (controlName === 'height') {
        return 'Invalid height (numbers only)';
      }
      if (controlName === 'bloodSugar') {
        return 'Invalid blood sugar level (numbers only)';
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

    if (controlName === 'followUpDate' && control?.hasError('invalidDate')) {
      return 'Follow Up Date must be in the future';
    }

    return '';  // No error
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;// open loading
      const patientUData = {
        _id: this.patientdata._id,
        visitstatus: 'notvisited',
      }
      const visitData = {
        weight: this.myForm.value.weight,
        height: this.myForm.value.height,
        bloodSugar: this.myForm.value.bloodSugar,
        bloodPressure: this.myForm.value.bloodPressure,
        patientId: this.patientdata._id,

        // prescription: this.myForm.value.prescription,
        // note: this.myForm.value.note,
        // examinedby: this.patientdata.nameofuser,
        // followUpDate: this.myForm.value.followUpDate,
        // CC: this.myForm.value.cc,
        // conclusion: this.myForm.value.conclusion,
      }
      this.patientsService.updatePatient_status(patientUData).subscribe({
        next: (response) => {
          //Call function from visit service to save visit data, only when patient data is saved successfully
          this.visitsService.saveNewVisitFour_R(visitData).subscribe({
            next: (response) => {
              const pendingData = {
                patient_id: this.patientdata._id,
                visit_id: response.data._id,
              }
              this.pendingService.savePending(pendingData).subscribe({
                next: (response) => {
                  this.isLoading = false;// close loading
                  this.dialogRef.close(this.patientdata._id);
                  this.openSucess("Patient Added to Checkup Queue."); // msg: patient added to checkup queue.
                },
                error: (error) => {
                  if (error.status === 409) {
                    //this.dialogRef.close(this.patientdata._id);
                    this.visitsService.deleteVisit(response.data._id).subscribe({
                      next: (response) => {
                        this.isLoading = false;
                        this.openWarning("Patient is already in checkup queue.");
                        this.dialogRef.close();
                      },
                      error: (error) => {
                        this.isLoading = false;
                        alert("Patient is already in pending queue; Err:pending, visit delete fail, patient status changed to 'notvisited'")
                        this.openWarning("Failed to add patient in checkup queue.");
                      }
                    })
                  }
                  else {
                    this.isLoading = false;
                    this.openFail("Failed to add patient to checkup queue.")
                    this.dialogRef.close(this.patientdata._id);
                    const patientUDataErr = {
                      _id: this.patientdata._id,
                      visitstatus: 'visited',
                    }
                    this.patientsService.updatePatient_status(patientUDataErr).subscribe({
                      next: (response) => {
                        //console.log("patients visited record reverted back to 'visited'");
                      },
                      error: (error) => {
                        //console.log("patients visited record not reverted back to 'visited'");
                      }
                    })
                    this.visitsService.deleteVisit(response.data._id).subscribe({
                      next: (response) => {
                        //console.log('created new visit data deleted successfully:', response);
                      },
                      error: (error) => {
                        //console.log('created new visit data deleted successfully:', error);
                      }
                    })
                  }
                }
              })
            },
            error: (error) => {
              //that means patient status is changed but new visit record is not created
              const patientUDataErr = {
                _id: this.patientdata._id,
                visitstatus: 'visited',
              }
              this.patientsService.updatePatient_status(patientUDataErr).subscribe({
                next: (response) => {
                  this.isLoading = false; // close loading
                  this.dialogRef.close();
                  this.openFail("Failed to add patient to checkup queue.");// msg:failed to add patient to checkup queue
                },
                error: (error) => {
                  alert("Fail:visit, err-patient status back to 'visited'.");
                  this.isLoading = false;  // close loading
                  this.dialogRef.close();
                  this.openWarning("Failed to add patient to chekup queue.");// msg: failed to change patient status, visit/clinical record is not created
                }
              })
            }
          })
        },
        error: (error) => {
          this.isLoading = false;// close loading
          this.dialogRef.close();
          this.openFail("Failed to add patient to Checkup Queue, Try again.");// msg: failed to add patient to checkup queue
        }
      })
    }
  }


  openExamineupDialog(patientdata: any) {

    const dialogRef = this.dialog.open(ExistingReciptVisitComponent, {
      width: '400px', // Adjust width as needed
      data: patientdata // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }

  //pending- patient already exists
  openAlreadyExistPendingDialog(patientdata: any) {
    const dialogRef = this.dialog.open(ExistingReciptAlreadyexistComponent, {
      width: '400px', // Adjust width as needed
      data: patientdata // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });

  }


  openErrorDialog(patientdata: any) {
    const dialogRef = this.dialog.open(RecordNotsaveComponent, {
      width: '400px', // Adjust width as needed
      data: patientdata // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });

  }




  openSucess(msg: any) {

    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }

  openWarning(msg: any) {

    const dialogRef = this.dialog.open(WarningComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }

  openFail(msg: any) {

    const dialogRef = this.dialog.open(FailComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }


}
