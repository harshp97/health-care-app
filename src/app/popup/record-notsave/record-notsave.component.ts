import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-record-notsave',
  standalone: false,
  templateUrl: './record-notsave.component.html',
  styleUrl: './record-notsave.component.css'
})
export class RecordNotsaveComponent {
  constructor(public dialogRef: MatDialogRef<RecordNotsaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any      // Data passed from the parent component
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
