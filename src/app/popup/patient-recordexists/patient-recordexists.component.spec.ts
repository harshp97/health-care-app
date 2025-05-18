import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRecordexistsComponent } from './patient-recordexists.component';

describe('PatientRecordexistsComponent', () => {
  let component: PatientRecordexistsComponent;
  let fixture: ComponentFixture<PatientRecordexistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientRecordexistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientRecordexistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
