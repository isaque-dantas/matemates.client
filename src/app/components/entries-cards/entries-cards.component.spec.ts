import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesCardsComponent } from './entries-cards.component';

describe('EntriesCardsComponent', () => {
  let component: EntriesCardsComponent;
  let fixture: ComponentFixture<EntriesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntriesCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntriesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
