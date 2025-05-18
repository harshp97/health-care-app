import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-existing-recipt-alreadyexist',
  standalone: false,
  templateUrl: './existing-recipt-alreadyexist.component.html',
  styleUrl: './existing-recipt-alreadyexist.component.css'
})
export class ExistingReciptAlreadyexistComponent {

  constructor(public dialogRef: MatDialogRef<ExistingReciptAlreadyexistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any      // Data passed from the parent component
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
