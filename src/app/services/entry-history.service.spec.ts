import { TestBed } from '@angular/core/testing';

import { EntryHistoryService } from './entry-history.service';

describe('EntryHistoryService', () => {
  let service: EntryHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
