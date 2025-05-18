import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-examine-update',
  standalone: false,
  templateUrl: './examine-update.component.html',
  styleUrl: './examine-update.component.css'
})
export class ExamineUpdateComponent {

  constructor(public dialogRef: MatDialogRef<ExamineUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any      // Data passed from the parent component
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
