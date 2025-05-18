import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitEditComponent } from './visit-edit.component';

describe('VisitEditComponent', () => {
  let component: VisitEditComponent;
  let fixture: ComponentFixture<VisitEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
