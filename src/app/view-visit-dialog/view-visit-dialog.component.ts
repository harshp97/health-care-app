import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-visit-dialog',
  standalone: false,
  templateUrl: './view-visit-dialog.component.html',
  styleUrl: './view-visit-dialog.component.css'
})
export class ViewVisitDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewVisitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any      // Data passed from the parent component
  ) { }

  ngOnInit() {
    console.log("\n\n", this.data);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
