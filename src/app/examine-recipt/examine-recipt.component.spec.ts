import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineReciptComponent } from './examine-recipt.component';

describe('ExamineReciptComponent', () => {
  let component: ExamineReciptComponent;
  let fixture: ComponentFixture<ExamineReciptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamineReciptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamineReciptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
