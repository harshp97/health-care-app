import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisitsService } from '../services/visit/visits.service'
import { PatientsService } from '../services/patient/patients.service';
import { ExamineUpdateComponent } from '../popup/examine-update/examine-update.component';
import { RecordNotsaveComponent } from '../popup/record-notsave/record-notsave.component';
import { UsersService } from '../services/user/users.service';
import { FailComponent } from '../popup/fail/fail.component';
import { SuccessComponent } from '../popup/success/success.component';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-examine-patient',
  standalone: false,
  templateUrl: './examine-patient.component.html',
  styleUrl: './examine-patient.component.css'
})
export class ExaminePatientComponent implements OnInit {
  myForm!: FormGroup;
  maxDate: Date;
  loggedinUserName: any;

  isLoading: boolean = false;

  loggedInUser: any;

  constructor(public dialogRef: MatDialogRef<ExaminePatientComponent>,
    @Inject(MAT_DIALOG_DATA) public patientdata: any,      // Data passed from the parent component
    private fb: FormBuilder,
    private visitsService: VisitsService, private patientsService: PatientsService,
    public dialog: MatDialog, private userService: UsersService
  ) {
    this.maxDate = new Date();
    dialogRef.disableClose = true;
  }


  ngOnInit() {
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
      pastHistory: [this.patientdata.pastHistory],
      familyHistory: [this.patientdata.familyHistory],

      prescription: ['', [Validators.required]],
      CC: [''],
      note: [''],
      followUpDate: ['', [Validators.required, this.followdateValidator]],
      conclusion: [''],

    });

    this.disablePatientData();
    this.getUserDetails();


  }



  disablePatientData() {
    this.myForm.get('name')?.disable();
    this.myForm.get('dob')?.disable();
    this.myForm.get('gender')?.disable();
    this.myForm.get('careOf')?.disable();
    this.myForm.get('address')?.disable();
    this.myForm.get('mobileNumber')?.disable();
    this.myForm.get('email')?.disable();
    this.myForm.get('pastHistory')?.disable();
    this.myForm.get('familyHistory')?.disable();

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
      const visitData = {
        weight: this.myForm.value.weight,
        height: this.myForm.value.height,
        bloodSugar: this.myForm.value.bloodSugar,
        bloodPressure: this.myForm.value.bloodPressure,
        patientId: this.patientdata._id,

        prescription: this.myForm.value.prescription,
        note: this.myForm.value.note,
        examinedby: this.loggedinUserName,
        followUpDate: this.myForm.value.followUpDate,
        CC: this.myForm.value.CC,
        conclusion: this.myForm.value.conclusion,
      }
      this.visitsService.saveVisitData_Examine(visitData).subscribe({
        next: (response) => {
          this.dialogRef.close(this.patientdata._id);
          this.openSucess("Patient's Examination Data Saved Successfully.");// patient's record saved successfully
          this.isLoading = false;// close loading
          this.generatePdf2();
        },
        error: (error) => {
          this.dialogRef.close();
          this.isLoading = false;// close loading
          this.openFail("Failed to Save Patient's Examination data, try again.");
        }
      })
    }
  }


  openExamineupDialog(patientid: any) {

    const dialogRef = this.dialog.open(ExamineUpdateComponent, {
      width: '400px', // Adjust width as needed
      data: patientid // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }


  openErrorDialog(patientdata: any) {
    const dialogRef = this.dialog.open(RecordNotsaveComponent, {
      width: '400px', // Adjust width as needed
      data: patientdata // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });

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




  openSucess(msg: any) {

    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  openFail(msg: any) {

    const dialogRef = this.dialog.open(FailComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
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
    const doctorPhone = this.loggedInUser.mobNum || '(+91) 9999555588';

    // --- Header Styling and Content ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setFontSize(16);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text(`Dr. ${doctorName}`, 20, 14);


    doc.setFontSize(11);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text(degree, 92, 14);



    doc.setFontSize(10);
    doc.setFont(normalFont, 'normal');
    doc.setTextColor('#000000');
    // doc.text(doctorName, 20, 30);
    doc.text(doctorAddress, 20, 30);

    //Date Rendering
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    const dateX = 150; // Adjust as needed to position the date (was 150)
    doc.text(doctorPhone, 20, 36);

    doc.setFontSize(10);
    doc.setFont(normalFont, 'normal');
    doc.setTextColor('#000000');
    doc.text(formattedDate, dateX, 36);

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
    const patientId = this.patientdata._id || '#'; //OCR Value this.loggedInUser._id
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
    const name = this.myForm.get('name')?.value; //OCR Value
    doc.text(`${name}`, leftMargin, nameY); // Value BELOW label


    //Age
    const ageX = 80;  //Position age
    const ageStr: any = this.calculateAge(this.myForm.get('dob')?.value); //Get age from Date Of Birth
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
    const numberStr = this.myForm.get('mobileNumber')?.value || 'na'; //OCR
    doc.text(numberStr, numberX, y + lineHeight);

    //Gender
    const genderX = 150;  //Position Gender
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Gender:", genderX, y); // Label ABOVE the value
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    const gender = this.myForm.get('gender')?.value || 'N/A';
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
    doc.text((this.myForm.get('weight')?.value || "na") + " Kg", leftMargin, weightY + lineHeight)  //Set value
    //Set  code for Height and Blood code to show in more short line, use numbers
    const heightX = 70
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Height :", heightX, weightY); // Lable
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('height')?.value || "na") + "cm", heightX, weightY + lineHeight) //Set value

    const B_SugarX = 110 //Where blood pressure will be rendered, use magic number.
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("B-Sugar :", B_SugarX, weightY); // Lable
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('bloodSugar')?.value || "na") + "mg/dL", B_SugarX, weightY + lineHeight) //Set value


    //Set Pressure, the more item here, you will start seeing the difference.
    const pressureX = 150 //Where blood pressure will be rendered, use magic number.
    doc.setFontSize(10);
    doc.setFont(boldFont, 'bold');
    doc.setTextColor(primaryColor);
    doc.text("Pressure:", pressureX, weightY); // Lable
    doc.setFont(normalFont, 'normal');
    doc.setTextColor(blackColor);
    doc.text((this.myForm.get('bloodPressure')?.value || "12") + "mmHg", pressureX, weightY + lineHeight) //Set value

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

    const namep = this.myForm.get('name')?.value
    doc.save(`${namep}-PRESCRIPTION.pdf`);
  }


}
