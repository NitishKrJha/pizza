import { TestBed } from '@angular/core/testing';

import { RouterStorageService } from './router-storage.service';

describe('RouterStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterStorageService = TestBed.get(RouterStorageService);
    expect(service).toBeTruthy();
  });
});
