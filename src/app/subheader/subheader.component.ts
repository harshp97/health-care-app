import { Component } from '@angular/core';


@Component({
  selector: 'app-subheader',
  standalone: false,
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.css',
})



export class SubheaderComponent {

  // isHidden = true => Field is hidden.
  // isHidden = false => Field is shown.
  isHidden: boolean = false;        // Controls business logic (true means tab should be hidden)
  profession: string = "Receptionist";

  ngOnInit() {
    setTimeout(() => {
      this.getLoginUserProfessionDetails();   // Show the field after 3 seconds
    }, 3000);

  }

  // getLoginUserProfessionDetails() {
  //   const professionR = localStorage.getItem('profession');
  //   if (professionR === "Receptionist") {
  //     this.profession = professionR;
  //     this.isHidden = true;   //show view reg as user is doc
  //   }
  // }

  getLoginUserProfessionDetails() {
    const professionR = localStorage.getItem('profession');
    if (professionR === "Receptionist") {
      this.profession = professionR;
      this.isHidden = true;  //show view reg as user is doc
    }
  }



}
