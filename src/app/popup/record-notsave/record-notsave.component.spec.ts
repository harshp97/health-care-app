import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordNotsaveComponent } from './record-notsave.component';

describe('RecordNotsaveComponent', () => {
  let component: RecordNotsaveComponent;
  let fixture: ComponentFixture<RecordNotsaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordNotsaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordNotsaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
