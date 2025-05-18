import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingReciptAlreadyexistComponent } from './existing-recipt-alreadyexist.component';

describe('ExistingReciptAlreadyexistComponent', () => {
  let component: ExistingReciptAlreadyexistComponent;
  let fixture: ComponentFixture<ExistingReciptAlreadyexistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExistingReciptAlreadyexistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingReciptAlreadyexistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
