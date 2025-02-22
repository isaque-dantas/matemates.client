import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostAccessedEntriesComponent } from './most-accessed-entries.component';

describe('MostAccessedEntriesComponent', () => {
  let component: MostAccessedEntriesComponent;
  let fixture: ComponentFixture<MostAccessedEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostAccessedEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostAccessedEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
