import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotGameComponent } from './slot-game.component';

describe('SlotGameComponent', () => {
  let component: SlotGameComponent;
  let fixture: ComponentFixture<SlotGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
