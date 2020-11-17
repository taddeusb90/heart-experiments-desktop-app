import { TestBed } from '@angular/core/testing';

import { SpectrometerService } from './spectrometer.service';

describe('SpectrometerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpectrometerService = TestBed.get(SpectrometerService);
    expect(service).toBeTruthy();
  });
});
