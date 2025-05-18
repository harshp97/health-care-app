import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SubheaderComponent } from './subheader/subheader.component';
import { NewRegistrationComponent } from './new-registration/new-registration.component';



import { MatToolbarModule } from '@angular/material/toolbar'; // For the header toolbar
import { MatButtonModule } from '@angular/material/button'; // For buttons
import { MatIconModule } from '@angular/material/icon'; // For icons
import { MatFormFieldModule } from '@angular/material/form-field'; // For form fields
import { MatInputModule } from '@angular/material/input'; // For text inputs
import { MatSelectModule } from '@angular/material/select'; // For select dropdowns
import { MatDatepickerModule } from '@angular/material/datepicker'; // For the datepicker
import { MatNativeDateModule } from '@angular/material/core'; // Required for MatDatepicker
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // For the dark/light mode toggle
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table'
import { DataDialogComponent } from './data-dialog/data-dialog.component';
import { DataTableComponent } from './data-table/data-table.component';
import { MatDialogModule } from '@angular/material/dialog';      // For MatDialog
import { MatCheckboxModule } from '@angular/material/checkbox'; // For MatCheckbox
import { HttpClientModule } from '@angular/common/http';
import { AccountDialogComponent } from './header/account-dialog/account-dialog.component';
import { SuccessComponent } from './popup/success/success.component';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchPatientComponent } from './search-patient/search-patient.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from 'ngx-clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExaminePatientComponent } from './examine-patient/examine-patient.component';
import { ExamineUpdateComponent } from './popup/examine-update/examine-update.component';
import { ExamineReciptComponent } from './examine-recipt/examine-recipt.component';
import { ExistingReciptVisitComponent } from './popup/existing-recipt-visit/existing-recipt-visit.component';
import { ExistingReciptAlreadyexistComponent } from './popup/existing-recipt-alreadyexist/existing-recipt-alreadyexist.component';
import { RecordNotsaveComponent } from './popup/record-notsave/record-notsave.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { PatientRecordexistsComponent } from './popup/patient-recordexists/patient-recordexists.component';
import { AgePipePipe } from './pipe/age-pipe.pipe';
import { MatListModule } from '@angular/material/list';
import { VisitEditComponent } from './visit-edit/visit-edit.component';
import { FailComponent } from './popup/fail/fail.component';
import { WarningComponent } from './popup/warning/warning.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ViewVisitDialogComponent } from './view-visit-dialog/view-visit-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SubheaderComponent,
    NewRegistrationComponent,
    DataDialogComponent,
    DataTableComponent,
    AccountDialogComponent,
    SuccessComponent,
    TimeAgoPipe,
    SearchPatientComponent,
    ExaminePatientComponent,
    ExamineUpdateComponent,
    ExamineReciptComponent,
    ExistingReciptVisitComponent,
    ExistingReciptAlreadyexistComponent,
    RecordNotsaveComponent,
    EditPatientComponent,
    PatientRecordexistsComponent,
    AgePipePipe,
    VisitEditComponent,
    FailComponent,
    WarningComponent,
    ViewVisitDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule, // Angular Material Toolbar
    MatButtonModule, // Angular Material Button
    MatIconModule, // Angular Material Icons
    MatFormFieldModule, // Angular Material Form Fields
    MatInputModule, // Angular Material Input
    MatSelectModule, // Angular Material Select
    MatDatepickerModule, // Angular Material Datepicker
    MatNativeDateModule, // Angular Material Datepicker Native Date Module
    ReactiveFormsModule, // Reactive Forms Module
    MatSlideToggleModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatListModule,
    MatProgressBarModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
