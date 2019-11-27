import { TestBed } from '@angular/core/testing';

import { SerialportService } from './serialport.service';

describe('SerialportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerialportService = TestBed.get(SerialportService);
    expect(service).toBeTruthy();
  });
});
