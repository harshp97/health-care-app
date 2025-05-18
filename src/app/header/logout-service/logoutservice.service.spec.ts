import { TestBed } from '@angular/core/testing';

import { LogoutserviceService } from './logoutservice.service';

describe('LogoutserviceService', () => {
  let service: LogoutserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
