import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-recordexists',
  standalone: false,
  templateUrl: './patient-recordexists.component.html',
  styleUrl: './patient-recordexists.component.css'
})
export class PatientRecordexistsComponent {

  constructor(public dialogRef: MatDialogRef<PatientRecordexistsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any      // Data passed from the parent component
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
