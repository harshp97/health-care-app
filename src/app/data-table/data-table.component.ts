import { Component, OnInit, Inject, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataDialogComponent } from '../data-dialog/data-dialog.component';
import { PatientsService } from "../services/patient/patients.service";
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { ExamineReciptComponent } from '../examine-recipt/examine-recipt.component';
import { ExistingReciptAlreadyexistComponent } from '../popup/existing-recipt-alreadyexist/existing-recipt-alreadyexist.component';
import { VisitEditComponent } from '../visit-edit/visit-edit.component';


@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})

export class DataTableComponent implements OnInit, OnChanges, AfterViewInit {

  //data from search component to display, search patient data
  @Input() searchTableData: any;

  constructor(private patientService: PatientsService, public dialog: MatDialog,
    private clipboardService: ClipboardService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getallPatientDetails();
  }


  ngOnChanges(changes: SimpleChanges): void { // Implement ngOnChanges
    if (changes['searchTableData'] && changes['searchTableData'].currentValue) {
      // 'searchTableData' changed and has a value
      this.tableData = changes['searchTableData'].currentValue;
      this.dataSource = new MatTableDataSource<PatientData>(this.tableData); // Update the dataSource
      this.dataSource.paginator = this.paginator; // Connect the paginator
    }
  }

  displayedColumns = ['_id', 'name', 'mobileNumber', 'email', 'address', 'gender', 'dob', 'visitstatus'];
  tableData: PatientData[] = [];
  dataSource!: MatTableDataSource<PatientData>;

  isLoading: boolean = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<PatientData>(this.tableData);
    this.dataSource.paginator = this.paginator;
  }



  clickedRows(row: any) {
    console.warn("hi", row);

    this.copyRowToClipboard(row);

    const professionD = localStorage.getItem('profession');
    if (professionD === "Doctor") {
      // this.openallVisitData_Dialog(row);

      //check for patient status; 
      // if visited- means create new visit/checkup record, -so openallVisitData_Dialog ;
      // if notvisited-means update latest visit record,, which recipt have either created in 1.new-regist or 2.search-patient follwed by examine-recipt  
      switch (row.visitstatus) {
        case "visited":
          this.openallVisitData_Dialog(row);
          break;

        case "notvisited":
          //generate new component with patient-row and get latest visit data either via pending or latest in visit list
          this.openallVisitData_Dialog_NotV(row);
          break;

        default:
          //for now it is openallvisitdata-dialog fun- but change later on
          // this.openallVisitData_Dialog(row);
          //or donot do anything just copy to clipboard
          break;
      }
    }
    else if (professionD === "Receptionist") {
      //check for patient status; if visited-open already exist dialog ; if notvisited-openallVisitData_Dialog_Recp func-which add pat to checkup que  
      switch (row.visitstatus) {
        case "visited":
          this.openallVisitData_Dialog_Recp(row);
          break;

        case "notvisited":
          this.patientExistinCheckupQue_Dialog_R(row);
          break;

        default:
          this.patientExistinCheckupQue_Dialog_R(row);
          break;
      }

    }
  }

  copyRowToClipboard(row: any): void {
    const idToCopy = row._id; // Extract _id from the row
    this.clipboardService.copy(idToCopy); // Copy the _id value

    this.snackBar.open(`_id: ${idToCopy}, copied to clipboard`, 'Close', { // Use snackBar
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    // alert('_id copied to clipboard!'); // Provide feedback
  }

  getallPatientDetails() {
    this.isLoading = true;
    this.patientService.getallPatientDetails().subscribe({
      next: (response) => {
        this.tableData = response.data;
        this.dataSource = new MatTableDataSource<PatientData>(this.tableData);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    })
  }

  openallVisitData_Dialog(row: any) {
    const dialogRef = this.dialog.open(DataDialogComponent, {
      width: 'auto',// Adjust width as needed
      height: '90vh',
      data: row // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.refreshData();
    });
  }

  openallVisitData_Dialog_NotV(row: any) {

    const dialogRef = this.dialog.open(VisitEditComponent, {
      width: 'auto',// Adjust width as needed
      height: '90vh',
      data: row // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.refreshData();
    });
  }

  openallVisitData_Dialog_Recp(row: any) {

    const dialogRef = this.dialog.open(ExamineReciptComponent, {
      width: 'auto',// Adjust width as needed
      height: '90vh',
      data: row // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.refreshData();
    });
  }

  patientExistinCheckupQue_Dialog_R(row: any) {
    const dialogRef = this.dialog.open(ExistingReciptAlreadyexistComponent, {
      width: '450px',// Adjust width as needed
      height: 'auto',
      data: row // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.refreshData();
    });
  }

  refreshData() {
    this.getallPatientDetails();
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

