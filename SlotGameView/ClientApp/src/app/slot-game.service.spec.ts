import { TestBed } from '@angular/core/testing';

import { SlotGameService } from './slot-game.service';

describe('SlotGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlotGameService = TestBed.get(SlotGameService);
    expect(service).toBeTruthy();
  });
});
