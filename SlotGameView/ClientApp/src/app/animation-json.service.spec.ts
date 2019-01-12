import { TestBed } from '@angular/core/testing';

import { AnimationJsonService } from './animation-json.service';

describe('AnimationJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnimationJsonService = TestBed.get(AnimationJsonService);
    expect(service).toBeTruthy();
  });
});
