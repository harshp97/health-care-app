import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientsService } from '../services/patient/patients.service';
import { VisitsService } from '../services/visit/visits.service';
import { PendingService } from '../services/pending/pending.service'
import { SuccessComponent } from '../popup/success/success.component';
import { RecordNotsaveComponent } from '../popup/record-notsave/record-notsave.component';
import { UsersService } from '../services/user/users.service';
import { FailComponent } from '../popup/fail/fail.component';
import { WarningComponent } from '../popup/warning/warning.component';
import { ViewVisitDialogComponent } from '../view-visit-dialog/view-visit-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from 'jspdf';



@Component({
  selector: 'app-visit-edit',
  standalone: false,
  templateUrl: './visit-edit.component.html',
  styleUrl: './visit-edit.component.css'
})
export class VisitEditComponent {
  myForm!: FormGroup;
  maxDate: Date;
  visitID: any;
  pendingID: any;
  loggedinUserName: any;

  isgetLoading: boolean = false;
  issubmitLoading: boolean = false;


  displayedColumns = ['weight', 'height', 'bloodSugar', 'bloodPressure', 'updatedAt', 'prescription', 'note', 'examinedby', 'followUpDate', 'CC', 'conclusion',];

  tableData: VisitData[] = [];
  dataSource = new MatTableDataSource<VisitData>(this.tableData);
  isLoadingHis: boolean = false;

  loggedInUser: any;

  ngOnInit(): void {

    this.myForm = this.fb.group({

      weight: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.max(160)]],
      height: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.max(250)]],
      bloodSugar: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4), Validators.max(1000)]],
      bloodPressure: [''],


      //entered by doctor
      pastHistory: [''],
      familyHistory: [''],

      prescription: ['', [Validators.required]],
      CC: [''],
      note: [''],
      followUpDate: ['', [Validators.required, this.followdateValidator]],
      conclusion: [''],

    });

    this.disablePreviousData();
    this.setPreviousValue_row();
    this.getVisitData();
    this.getUserDetails();
    this.getallVisitDetails_byPatientID(this.row._id);

  }


  constructor(private fb: FormBuilder,
    private visitsService: VisitsService, private patientsService: PatientsService,
    private pendingService: PendingService,
    private userService: UsersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<VisitEditComponent>,
    @Inject(MAT_DIALOG_DATA) public row: any,  //data comming from parent


  ) {
    this.maxDate = new Date();
  }


  getVisitData() {
    this.isgetLoading = true;
    //get visit id from pending list based on patient id(row._id)

    //if u get; populate visit data via visit_id from pending
    //if u donot get anything; then get all visits based on patientid(row._id) ; 
    // if  in latest visit - prescription is not there then populate latest in form
    // else if prescription is there then close this visitedit dialog

    //populate visit from response from pending


    //get visitid from pending
    this.pendingService.getPending_Pid(this.row._id).subscribe({
      next: (response) => {
        // after getting pending list; set visitid into a variable to be used further(update visit record)
        this.visitID = response.data[0].visit_id;
        this.pendingID = response.data[0]._id;
        //populate visit: based on visit id wiz got from Pending Service
        this.visitsService.getVisitDetails_byVisitID(response.data[0].visit_id).subscribe({
          next: (response) => {
            this.isgetLoading = false;
            this.setVisitValue_SRV(response.data[0]);
          },
          error: (error) => {
            //populate visit: based on patient id wiz got from row
            this.visitsService.getallVisitDetails_byPatientID(this.row._id).subscribe({
              next: (response) => {
                this.isgetLoading = false;
                this.setVisitValue_SRV(response.data[0]);
              },
              error: (error) => {
                this.isgetLoading = false;
                this.openFailDialog(this.row);//msg:failed to get visit from visit record
                this.dialogRef.close();
              }
            })
          }
        })
      },
      error: (error) => {
        this.isgetLoading = false;
        this.openFailDialog(this.row);//msg:failed to get patient from pending record
        this.dialogRef.close();
      }
    })
  }

  getPatientData() {
    this.patientsService.searchPby_id(this.row._id).subscribe({
      next: (response) => {
        console.log("from row patient id", response.data);
        this.setPatientValue_SRV(response.data[0]);
      },
      error: (error) => {
        this.openFailDialog(this.row);//msg:failed to get visit from visit record
        this.dialogRef.close();
      }
    })
  }


  //set patient data from service
  setPatientValue_SRV(patientdata: any) {
    console.log(patientdata);

    this.myForm.get('familyHistory')?.setValue(patientdata.familyHistory);
    this.myForm.get('pastHistory')?.setValue(patientdata.pastHistory);
  }

  //set visit data from service
  setVisitValue_SRV(visitdata: any) {
    console.log(visitdata);

    this.myForm.get('weight')?.setValue(visitdata.weight);
    this.myForm.get('height')?.setValue(visitdata.height);
    this.myForm.get('bloodSugar')?.setValue(visitdata.bloodSugar);
    this.myForm.get('bloodPressure')?.setValue(visitdata.bloodPressure);
  }

  //set values from row
  setPreviousValue_row() {
    console.log(this.row);

    //from row visit data will not come
    // this.myForm.get('weight')?.setValue(this.row.weight);
    // this.myForm.get('height')?.setValue(this.row.height);
    // this.myForm.get('bloodSugar')?.setValue(this.row.bloodSugar);
    // this.myForm.get('bloodPressure')?.setValue(this.row.bloodPressure);


    //set patient's history if avail from clicked row
    //for existing patient
    this.myForm.get('familyHistory')?.setValue(this.row.familyHistory);
    this.myForm.get('pastHistory')?.setValue(this.row.pastHistory);

  }

  disablePreviousData() {
    this.myForm.get('weight')?.disable();
    this.myForm.get('height')?.disable();
    this.myForm.get('bloodSugar')?.disable();
    this.myForm.get('bloodPressure')?.disable();

  }

  getUserDetails() {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.loggedinUserName = response.data.nameofuser;
        this.loggedInUser = response.data;
      },
      error: (error) => {

      }
    })

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


    if (control?.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength}`;
    }

    if (control?.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }

    if (controlName === 'followUpDate' && control?.hasError('invalidDate')) {
      return 'Follow Up Date must be in the future';
    }

    return '';  // No error
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.issubmitLoading = true;//open loading
      //update visit record
      //   update patient family,past,status
      //      delete pending list

      const visitData = {
        _id: this.visitID,
        prescription: this.myForm.value.prescription,
        note: this.myForm.value.note,
        examinedby: this.loggedinUserName,
        followUpDate: this.myForm.value.followUpDate,
        CC: this.myForm.value.CC,
        conclusion: this.myForm.value.conclusion,

      }
      this.visitsService.updateVisit(visitData).subscribe({
        next: (response) => {
          const patientData = {
            _id: this.row._id,
            pastHistory: this.myForm.value.pastHistory,
            familyHistory: this.myForm.value.familyHistory,
            visitstatus: "visited",
          }
          this.patientsService.updatePatient(patientData).subscribe({
            next: (response) => {
              this.pendingService.deletePending(this.pendingID).subscribe({
                next: (response) => {
                  this.issubmitLoading = false//close loading
                  this.openSucess("Patients examination Record Updated Successfully");//msg: patient record added successfully
                  this.dialogRef.close();
                  this.generatePdf2();
                },
                error: (error) => {
                  this.issubmitLoading = false;// close loading
                  alert('Failed: pending delete; visit updated and patient status=visited');
                  this.openWarning("Error while updating examination record.");//msg:failed- updated visit and patient data but not able to delete from pending record; cont admin
                  this.dialogRef.close();
                }
              })
            },
            error: (error) => {
              this.issubmitLoading = false;// close loading
              alert("Fail: Patient; visit updated.")
              this.openWarning("Failed to Update patient examination data.");//msg:failed- updated visit data but not patient record
              this.dialogRef.close();
            }
          })
        },
        error: (error) => {
          this.issubmitLoading = false;//close dialog
          this.openFail("Failed to Update Patient's Examination Data, Try Again");//msg:failed update visit record
          this.dialogRef.close();
        }
      })
    }
  }

  resetForm(): void {
    this.myForm.reset();
    Object.keys(this.myForm.controls).forEach(key => {
      this.myForm.get(key)?.setErrors(null);
    });
  }

  markAllAsTouched() {
    Object.keys(this.myForm.controls).forEach(controlName => {
      this.myForm.get(controlName)?.markAsTouched();
    });
  }

  openSuccessDialog(patientid: any) {

    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '400px', // Adjust width as needed
      data: patientid // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }


  openFailDialog(patientdata: any) {
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
      this.resetForm();  //reset form 
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
      this.resetForm();  //reset form 
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
      this.resetForm();  //reset form 
    });
  }


  getallVisitDetails_byPatientID(patientId: any) {
    this.isLoadingHis = true;//open loading
    this.visitsService.getallVisitDetails_byPatientID(patientId)
      .subscribe({
        next: (response) => {
          console.log('API Response of visit :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
          this.isLoadingHis = false;//close loading
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isLoadingHis = false;//close loading
        }
      });
  }

  clickedRows(row: any) {
    console.warn("hi", row);

    //open view-visit-dialog
    const dialogRef = this.dialog.open(ViewVisitDialogComponent, {
      width: 'auto',// Adjust width as needed
      height: 'auto',
      data: row // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
    });


  }

  calculateAge(birthday: Date | null): string { // correct type
    if (!birthday) return 'N/A';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  }

  generatePdf2() {
    const doc = new jsPDF();
    let pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();


    // --- Colors ---
    const primaryColor = '#B91C1C'; // Red
    const blackColor = '#000000';  // Black

    // --- Fonts ---
    const boldFont = 'helvetica';
    const normalFont = 'helvetica';
    const italicFont = 'helvetica'; //Add font for italic font

    // --- Header Information ---
    const headerTitle = 'PRESCRIPTION TEMPLATE';
    const doctorName = this.loggedInUser.nameofuser;//'Dr. Shrimant Kumar Sahu, ';
    const degree = this.loggedInUser.Degree || "MBBS";
    const doctorAddress = this.loggedInUser.hospitalAddress || 'Om HealthCare, Bhatagaon, Near Soankar Petroleum, Raipur';
    const doctorPhone = this.loggedInUser.mobNum || '(+91) 9999999999';

    // --- Header Styling and Content ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 20, 'F');
    const doctorNameLeftMargin = 8; // Reduced from 20 to 10

    doc.setFontSize(16);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text(`Dr. ${doctorName}`, doctorNameLeftMargin, 11);

    // Dynamically position degree
    doc.setFontSize(11);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text(degree, doctorNameLeftMargin, 18);



    doc.setFontSize(10);
    doc.setFont(normalFont, 'normal');
    doc.setTextColor('#000000');
    // doc.text(doctorName, 20, 30);
    doc.text(doctorAddress, 20, 30);

    //Date Rendering
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    const dateX = 160; // Adjust as needed to position the date (was 150)
    doc.text(doctorPhone, 20, 36);

    doc.setFontSize(10);
    doc.setFont(normalFont, 'normal');
    doc.setTextColor('#000000');
    doc.text(`Date- ${formattedDate}`, dateX, 36);

    doc.setLineWidth(0.5);
    doc.setDrawColor(primaryColor);
    doc.line(20, 42, 190, 42);

    // --- Form Content ---
    let y = 52; // Start Y position
    const lineHeight = 8; // Reduce line height for a more compact layout
    const leftMargin = 20;
    const valueStartX = 20;
    pageWidth = doc.internal.pageSize.getWidth();

    //  ----- Patient Contact Information -----

    // Header Title of Page.
    doc.setFontSize(12);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(blackColor);
    doc.text('Patient Contact Information', leftMargin, y);

    //Patient Unique ID
    const patientId = this.row._id || '#'; //OCR Value this.loggedInUser._id
    doc.setFontSize(10); // Smaller font size
    doc.setFont(italicFont, 'italic'); // Italic font
    doc.setTextColor(blackColor);
    const idTextWidth = doc.getTextWidth(`ID: ${patientId}`); //Calculate width to render next to text correctly
    const idX = pageWidth - leftMargin - idTextWidth;  //Position it on the right
    doc.text(`ID: ${patientId}`, idX, y);


    y += lineHeight * 1.5;


    //Name
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Name:", leftMargin, y); // Label ABOVE the value
    const nameY = y + lineHeight
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    const name = this.row.name; //OCR Value
    doc.text(`${name}`, leftMargin, nameY); // Value BELOW label


    //Age
    const ageX = 80;  //Position age
    const ageStr: any = this.calculateAge(this.row.dob); //Get age from Date Of Birth
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Age:", ageX, y); // Label ABOVE the value
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    if (ageStr) {
      doc.text(ageStr, ageX, y + lineHeight)
    }


    //Mobile Number
    const numberX = 110//Adjust, Position of Number
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Number:", numberX, y); // Label ABOVE the value
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    const numberStr = this.row.mobileNumber || '#'; //OCR
    doc.text(numberStr, numberX, y + lineHeight);

    //Gender
    const genderX = 150;  //Position Gender
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Gender:", genderX, y); // Label ABOVE the value
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    const gender = this.row.gender || 'N/A';
    doc.text(gender, genderX, y + lineHeight);

    y += lineHeight * 3//To force the rendering code


    // ----- Vitals Information -----
    doc.setFontSize(12);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(blackColor);
    doc.text('Vitals Information', leftMargin, y);
    y += lineHeight * 1.5;

    //Weight, Height and S Pressure must all be in row.
    //Set the same y as before just set X position to make it show all of it
    const weightY = y
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Weight :", leftMargin, weightY); // Label ABOVE the value
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('weight')?.value || "#") + " kg", leftMargin, weightY + lineHeight)  //Set value
    //Set  code for Height and Blood code to show in more short line, use numbers
    const heightX = 70
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Height :", heightX, weightY); // Lable
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('height')?.value || "#") + " cm", heightX, weightY + lineHeight) //Set value

    const B_SugarX = 110 //Where blood pressure will be rendered, use magic number.
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Sugar :", B_SugarX, weightY); // Lable
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('bloodSugar')?.value || "#") + " mg/dL", B_SugarX, weightY + lineHeight) //Set value


    //Set Pressure, the more item here, you will start seeing the difference.
    const pressureX = 150 //Where blood pressure will be rendered, use magic number.
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Pressure:", pressureX, weightY); // Lable
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('bloodPressure')?.value || "#") + " mmHg", pressureX, weightY + lineHeight) //Set value

    y += lineHeight * 3

    // --- Prescription (Without Box) ---
    const prescriptionLabel = "Prescription:";
    const prescriptionText = this.myForm.get('prescription')?.value || "";
    const rxSymbolX = leftMargin;  //Was 5
    const prescriptionStartX = leftMargin + 10; // Was 5, Set as left

    //Set RX Code
    doc.setFontSize(10);
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text("Rx", leftMargin, y + lineHeight); //Adjust the label Y to a bit
    y += 16

    //Add split to next line to fix and see what's being rendered
    let textLines = doc.splitTextToSize(prescriptionText, (pageWidth - leftMargin * 2))  //To make sure

    textLines.forEach((line: any) => {
      //Set code to check rendering page
      if (y > pageHeight - 10) {
        //New Page if more then page height to what text are
        doc.addPage()
        //This code renders if more then text, change if you feel
        y = 20
        doc.setFontSize(10)
        doc.setFont(normalFont, 'normal');
        doc.setTextColor(blackColor);
        doc.text(line, valueStartX + 1, y) //render to top for any text you write
      }

      //Render nextY after code
      doc.setFontSize(10)
      doc.setFont(normalFont, 'normal');
      doc.setTextColor(blackColor);
      doc.text(line, leftMargin + 10, y + 8) //Render more, as 2nd is called
      y += lineHeight + 2  //Spacing should  as same
    });



    const footerText = 'This is a system-generated prescription. Not valid without signature.';
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(footerText, 20, doc.internal.pageSize.height - 20); // Bottom of the page

    const namep = this.row.name;
    doc.save(`${namep}-PRESCRIPTION.pdf`);
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
