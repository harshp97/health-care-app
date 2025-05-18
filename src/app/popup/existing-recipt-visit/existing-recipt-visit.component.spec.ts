import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingReciptVisitComponent } from './existing-recipt-visit.component';

describe('ExistingReciptVisitComponent', () => {
  let component: ExistingReciptVisitComponent;
  let fixture: ComponentFixture<ExistingReciptVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExistingReciptVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingReciptVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
