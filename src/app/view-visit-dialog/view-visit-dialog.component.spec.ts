import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVisitDialogComponent } from './view-visit-dialog.component';

describe('ViewVisitDialogComponent', () => {
  let component: ViewVisitDialogComponent;
  let fixture: ComponentFixture<ViewVisitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewVisitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVisitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
