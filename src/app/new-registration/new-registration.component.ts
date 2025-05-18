import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/user/users.service';
import { PatientsService } from '../services/patient/patients.service'
import { MatDialog } from '@angular/material/dialog';
import { SuccessComponent } from '../popup/success/success.component';
import { VisitsService } from '../services/visit/visits.service'
import { PendingService } from '../services/pending/pending.service';
import { RecordNotsaveComponent } from '../popup/record-notsave/record-notsave.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { WarningComponent } from '../popup/warning/warning.component';
import { FailComponent } from '../popup/fail/fail.component';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-new-registration',
  standalone: false,
  templateUrl: './new-registration.component.html',
  styleUrl: './new-registration.component.css',
  animations: [
    trigger('fadeSlideGroup', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98) translateY(-8px)' }),
        animate('1200ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('1300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'scale(0.98) translateY(-8px)' }))
      ])
    ])
  ]
})

export class NewRegistrationComponent implements OnInit {
  myForm!: FormGroup;
  maxDate: Date;

  hasVisited: boolean = false; //check for next time
  visitCount: number = 0;      //number of time patient visited

  submissionTime: Date = new Date(); // Example: Timestamp
  isHidden: boolean = false;
  loggedInUser: any;
  submitButtonName = 'Submit';

  isLoading: boolean = false;

  patientPrescp: any;
  visitPrescp: any;


  constructor(private fb: FormBuilder, private userData: UsersService,
    private patientsService: PatientsService, private pendingService: PendingService,
    public dialog: MatDialog, private VisitsService: VisitsService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required, this.dateValidator]],
      gender: ['', [Validators.required]],
      careOf: ['', [Validators.minLength(3)]],
      address: [''],

      mobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.email]],


      weight: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.max(160)]],
      height: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(3), Validators.max(250)]],
      bloodSugar: [''],
      bloodPressure: [''],


      //entered by doctor
      pastHistory: [''],
      familyHistory: [''],

      prescription: [''],
      CC: [''],
      note: [''],
      followUpDate: ['', [this.followdateValidator]],
      conclusion: [''],

    });


    setTimeout(() => {
      this.getLoginUserDetails();   // Show the field after 3 seconds
    }, 3000);

  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Save : ', this.myForm.value); // Process the form data
      // console.log("name: ", this.myForm.value.name);
      // You can send the data to an API or perform other actions here.

      switch (this.loggedInUser.profession) {
        case "Receptionist":
          this.saveNewPatient_R(this.myForm.value);
          break;

        case "Doctor":
          this.saveNewPatient_D(this.myForm.value);
          break;

        default:
          console.log("ERR from switch!");
          alert("No Data Saved, user entry incorrect contact ADMIN");
          this.markAllAsTouched();
          break;
      }


      // const formValues = this.myForm.value;

    } else {
      // Trigger validation to show errors
      this.markAllAsTouched();
      console.log('ERR');
    }
  }
  /*
   name: { type: String, required: true, index: true },
      mobileNumber: { type: String, required: true, index: true },
      dob: { type: Date, required: true },
      gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
      email: { type: String },
      careOf: { type: String },
      address: { type: String },
      visitstatus: { type: String, enum: ["visited", "notvisited"], default: "notvisited" },
      totalVisit: { type: Number, default: 0 },
      createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      pasthistory: { type: String },
      familyHistory: { type: String },
  */

  //temp  all ok we can replace this with recipt save func
  saveNewPatient_R(formValues: any) {
    this.isLoading = true;//open loading
    const patientData = {
      name: formValues.name,
      mobileNumber: formValues.mobileNumber,
      dob: formValues.dob,
      gender: formValues.gender,
      email: formValues.email,
      careOf: formValues.careOf,
      address: formValues.address,
      createdby: this.loggedInUser._id,
      visitstatus: "notvisited",
      totalVisit: 1,
    };
    this.patientsService.savePatientData_R(patientData).subscribe({
      next: (response) => {
        const visitData = {
          weight: formValues.weight,
          height: formValues.height,
          bloodSugar: formValues.bloodSugar,
          bloodPressure: formValues.bloodPressure,
          patientId: response.data._id,
          examinedby: this.loggedInUser.nameofuser, //need to delete this field as user is recpt.
        }
        let newPatientID = response.data._id;
        this.VisitsService.saveVisitData_R(visitData).subscribe({
          next: (response) => {
            const pendingData = {
              patient_id: response.data.patientId,
              visit_id: response.data._id,
            }
            this.pendingService.savePending(pendingData).subscribe({
              next: (response) => {
                this.openSucess("Patient Added Successfully; and Added to Checkup Queue");  //msg: patient record created successfully
                this.isLoading = false;// close loading
              },
              error: (error) => {
                this.VisitsService.deleteVisit(response.data._id).subscribe({
                  next: (response) => {
                    const delPatient = {
                      _id: newPatientID,
                    }
                    this.patientsService.deletePatient(delPatient).subscribe({
                      next: (response) => {
                        this.openFail("Failed to Save Data, Please Try Again.");//msg: Failed to create new record, pls try again.
                        this.isLoading = false;// close loading
                      },
                      error: (error) => {
                        alert("failed to create pending: visit deleted, but error in deleting patient");
                        this.openWarning("error:pending; visit deleted,failed in delete-patient");//open faile dialog: msg- failed to create patient ; ask admin to delete this patient record; pls note time.
                        this.isLoading = false;// close loading
                      }
                    })
                  },
                  error: (error) => {
                    alert("failed to delete visit, after creating patient, err-in creating pending");
                    this.openWarning("error:pending; failed in delete-visit");//open fail log; msg:-failed to create patient ; ask admin to delete this patient personal and clinical record. 
                    this.isLoading = false;// close loading
                  }
                })
              }
            })
          },
          error: (error) => {
            const delPatient = {
              _id: newPatientID,
            }
            this.patientsService.deletePatient(delPatient).subscribe({
              next: (response) => {
                this.openFail("Failed to Save Data, Please Try Again.");//msg: failed to save data; retry again.
                this.isLoading = false;// close loading
              },
              error: (error) => {
                alert("failed to create visit: but failed to delete patient");
                //visit is not created but patient data is still there with pending status
                //data-integrity
                this.openWarning("error:visit; failed in delete-patient");//msg: failed to save clinical record(weight, height, bp & sugar); but patient personal info is saved.
                this.isLoading = false;// close loading
              }
            })
          }
        })
      },
      error: (error) => {
        this.openFail("Failed to Save Data, Please Try Again.");//msg: failed to save data; try again.
        this.isLoading = false;// close loading
      }
    })
  }


  //temp
  saveNewPatient_D(formValues: any) {
    this.isLoading = true;//open loading
    const patientData = {
      name: formValues.name,
      mobileNumber: formValues.mobileNumber,
      dob: formValues.dob,
      gender: formValues.gender,
      email: formValues.email,
      careOf: formValues.careOf,
      address: formValues.address,
      createdby: this.loggedInUser._id,
      visitstatus: "visited",
      totalVisit: 1,
      pastHistory: formValues.pastHistory,
      familyHistory: formValues.familyHistory,
    }
    this.patientsService.savePatientData_D(patientData).subscribe({
      next: (response) => {
        this.patientPrescp = response;
        const visitData = {
          weight: formValues.weight,
          height: formValues.height,
          bloodSugar: formValues.bloodSugar,
          bloodPressure: formValues.bloodPressure,
          patientId: response.data._id,

          prescription: formValues.prescription,
          note: formValues.note,
          examinedby: this.loggedInUser.nameofuser,
          followUpDate: formValues.followUpDate,
          CC: formValues.CC,
          conclusion: formValues.conclusion,
        }
        this.VisitsService.saveVisitData_D(visitData).subscribe({
          next: (response) => {
            this.openSucess("New Patient Created Successfully.");  //msg: patient record created successfully
            this.isLoading = false;// close loading
            this.generatePdf2();
          },
          error: (error) => {
            const delPatient = {
              _id: response.data._id,
            }
            this.patientsService.deletePatient(delPatient).subscribe({
              next: (response) => {
                this.openFail("Failed to Save Data, Please Try Again.");//msg: failed to save data; try again.
                this.isLoading = false;// close loading
              },
              error: (error) => {
                alert("fail to delete patient personal data; but visit record exists.");
                this.openWarning("error:visit; failed in delete-patient");//msg: fail to delete patient personal data; but visit record exists.
                this.isLoading = false;// close loading
              }
            })
          }
        })
      },
      error: (error) => {
        this.openFail("Failed to Save Data, Please Try Again.");//msg: failed to save data; try again.
        this.isLoading = false;// close loading
      }
    })

  }


  markAllAsTouched() {
    Object.keys(this.myForm.controls).forEach(controlName => {
      this.myForm.get(controlName)?.markAsTouched();
    });
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

  getLoginUserDetails() {
    this.userData.getCurrentUser().subscribe({
      next: (response) => {
        this.loggedInUser = response.data;
        // console.log('Logged user data:', this.loggedInUser);
        if (this.loggedInUser.profession === "Receptionist") {
          this.showFieldforDoctor();
          this.submitButtonName = 'Submit & Add to checkup queue'
        }
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    })
  }

  showFieldforDoctor() {
    // isHidden = true => Field is hidden.
    // isHidden = false => Field is shown.
    this.isHidden = true;
  }


  openAccountDialog(response: any) {

    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '400px', // Adjust width as needed
      data: response // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.resetForm();  //reset form 
    });
  }

  openFailDialog() {

    const dialogRef = this.dialog.open(RecordNotsaveComponent, {
      width: '400px', // Adjust width as needed
      data: "ERR" // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.resetForm();  //reset form 
    });
  }

  resetForm(): void {

    this.myForm.reset();
    Object.keys(this.myForm.controls).forEach(key => {
      this.myForm.get(key)?.setErrors(null);
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
    const patientId = this.patientPrescp._id || '#'; //OCR Value this.loggedInUser._id
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