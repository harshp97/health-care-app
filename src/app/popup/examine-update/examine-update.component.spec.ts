import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineUpdateComponent } from './examine-update.component';

describe('ExamineUpdateComponent', () => {
  let component: ExamineUpdateComponent;
  let fixture: ComponentFixture<ExamineUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamineUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamineUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
