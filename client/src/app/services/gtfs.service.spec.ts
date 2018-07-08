import { TestBed, inject } from '@angular/core/testing';

import { GTFSService } from './gtfs.service';

describe('GTFSService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GTFSService]
    });
  });

  it('should be created', inject([GTFSService], (service: GTFSService) => {
    expect(service).toBeTruthy();
  }));
});
