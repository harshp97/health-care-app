import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitsService } from '../services/visit/visits.service'
import { MatTableDataSource } from "@angular/material/table";
import { PatientsService } from '../services/patient/patients.service';
import { MatDialog } from '@angular/material/dialog';
import { ExaminePatientComponent } from '../examine-patient/examine-patient.component'
import { ViewVisitDialogComponent } from '../view-visit-dialog/view-visit-dialog.component';

@Component({
  selector: 'app-data-dialog',
  standalone: false,
  templateUrl: './data-dialog.component.html',
  styleUrls: ['./data-dialog.component.css'],
})



export class DataDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  //data comming from parent
    private visitService: VisitsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getallVisitDetails_byPatientID(this.data._id);
  }

  displayedColumns = ['weight', 'height', 'bloodSugar', 'bloodPressure', 'updatedAt', 'prescription', 'note', 'examinedby', 'followUpDate', 'CC', 'conclusion',];

  tableData: VisitData[] = [];
  dataSource = new MatTableDataSource<VisitData>(this.tableData);
  isLoading: boolean = false;


  // Method to handle the "Cancel" button click
  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without saving any data
  }

  // Method to handle the "Submit" button click
  onSubmitClick(): void {
    // You can access and process the data here
    console.log("Data submitted:", this.data);
    // Close the dialog and pass the data back to the parent component
    this.dialogRef.close(this.data); // Pass data back to parent
  }


  getallVisitDetails_byPatientID(patientId: any) {
    this.isLoading = true;//open loading
    this.visitService.getallVisitDetails_byPatientID(patientId)
      .subscribe({
        next: (response) => {
          console.log('API Response of visit :', response.data);
          this.tableData = response.data;
          this.dataSource.data = this.tableData;
          this.isLoading = false;//close loading
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isLoading = false;//close loading
        }
      });
  }

  examinePatient() {
    this.dialogRef.close();
  }

  openAccountDialog() {
    this.dialogRef.close();

    const dialogRef = this.dialog.open(ExaminePatientComponent, {
      width: 'auto', // Adjust width as needed
      height: '90vh',
      data: this.data // Pass user data to the dialog | patient data from row selection
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
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



//to to added in table
// visitNumber
// weight
// height
// bloodSugar
// bloodPressure
// prescription
// note
// examinedby
// followUpDate
// CC
// conclusion
// updatedAt


// _id
// visitNumber
// weight
// height
// bloodSugar
// bloodPressure
// prescription
// note
// examinedby
// followUpDate
// CC
// conclusion
// patientId
// createdAt
// updatedAt




