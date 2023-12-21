import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECockpitComponent } from './e-cockpit.component';

describe('ECockpitComponent', () => {
  let component: ECockpitComponent;
  let fixture: ComponentFixture<ECockpitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ECockpitComponent]
    });
    fixture = TestBed.createComponent(ECockpitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
