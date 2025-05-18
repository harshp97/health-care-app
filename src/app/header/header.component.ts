import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UsersService } from "../services/user/users.service";
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoutserviceService } from './logout-service/logoutservice.service';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})



export class HeaderComponent implements OnInit {
  @Output() themeToggled = new EventEmitter<void>();
  isDarkMode = false;
  modeName!: string;
  isMenuOpen = false;
  isCreateMenuOpen = false;
  showModeBinO!: boolean;   //show or hide mode button in side cart!! 
  useraccountDialog: any;
  isLoggedin: boolean = true;

  constructor(private userData: UsersService, public dialog: MatDialog,
    private logoutService: LogoutserviceService
  ) { }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.getUserDetail();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.themeToggled.emit(); // Notify the parent component (app.component)
  }

  toggleMenu() { // hamburger
    this.calcWindWidth();
    this.isMenuOpen = !this.isMenuOpen;    //open-true,, close-false
  }



  toggleCreateMenu() { // Add this method
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
  }

  calcWindWidth() {
    if (window.innerWidth <= 450) {
      this.showModeBinO = true;
    }
    else {
      this.showModeBinO = false;
    }
  }

  getUserDetail() {

    this.userData.getCurrentUser().subscribe({
      next: (response) => {
        this.useraccountDialog = response.data
        localStorage.setItem('profession', response.data.profession);
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    })
  }

  openAccountDialog(): void {

    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '400px', // Adjust width as needed
      data: this.useraccountDialog // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed (e.g., refresh data)
    });
  }

  logoutUser() {
    this.userData.logoutUser().subscribe({
      next: (response) => {
        this.logoutService.setLoginStatus(false);
        this.isLoggedin = false;
        localStorage.setItem('accessToken', "1");
        localStorage.setItem('refreshToken', "1");
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isLoggedin = true;

      }
    })
  }

}