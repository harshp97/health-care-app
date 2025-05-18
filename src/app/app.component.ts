import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UsersService } from './services/user/users.service';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FailComponent } from './popup/fail/fail.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoutserviceService } from './header/logout-service/logoutservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isDarkMode = false;
  isLoggedIn = false;

  isCookie = false;

  myForm!: FormGroup;
  isLoading: boolean = false;
  hidePassword: boolean = true;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document,
    private userService: UsersService, private fb: FormBuilder, public dialog: MatDialog,
    private logoutService: LogoutserviceService) { }

  ngOnInit() {
    this.loadTheme(); // Load theme on startup
    //  this.loginUser(); //login user\
    this.checkInCookiesf();

    this.myForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });


    //for logout button
    this.logoutService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      // You can trigger any logic here on login/logout
    });

  }

  onThemeToggled() { // NEW: Handle the event
    this.loadTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.saveTheme();
    this.applyTheme();
  }

  private loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    this.isDarkMode = storedTheme === 'dark';
    this.applyTheme();

  }

  private saveTheme() {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }

  handleLogin(success: boolean) {
    this.isLoggedIn = success;
  }

  checkInCookiesf() {
    this.userService.checkInCookies().subscribe({
      next: (response) => {
        this.isCookie = true;
        this.isLoggedIn = true;
        localStorage.setItem('refreshToken', response.data[0].refreshToken);
        // Store the new access token in memory or auth state
      },
      error: () => {
        this.isLoggedIn = false;
        this.isCookie = false;
        // User is not logged in; shows to login page if needed
      }

    })

  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      this.userService.loginUser(this.myForm.value).subscribe({
        next: (response) => {
          //this.loginFailed = false;
          this.isLoggedIn = true;
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.isLoggedIn = false;
          //this.resetForm();
          // this.loginFailed = true;
          this.openFail("Invalid credentials")
        }
      });

    }

  }

  resetForm(): void {
    this.myForm.reset();
    Object.keys(this.myForm.controls).forEach(key => {
      this.myForm.get(key)?.setErrors(null);
    });
  }

  openFail(msg: any) {

    const dialogRef = this.dialog.open(FailComponent, {
      width: '400px', // Adjust width as needed
      data: msg, // Pass user data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed (e.g., refresh data)
      this.resetForm();  //reset form 
    });
  }

}