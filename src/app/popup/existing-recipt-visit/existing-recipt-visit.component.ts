import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-existing-recipt-visit',
  standalone: false,
  templateUrl: './existing-recipt-visit.component.html',
  styleUrl: './existing-recipt-visit.component.css'
})
export class ExistingReciptVisitComponent {

  constructor(public dialogRef: MatDialogRef<ExistingReciptVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any      // Data passed from the parent component
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}

