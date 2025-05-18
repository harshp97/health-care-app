import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminePatientComponent } from './examine-patient.component';

describe('ExaminePatientComponent', () => {
  let component: ExaminePatientComponent;
  let fixture: ComponentFixture<ExaminePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminePatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
