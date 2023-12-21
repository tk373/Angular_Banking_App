import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpittableComponent } from './cockpittable.component';

describe('CockpittableComponent', () => {
  let component: CockpittableComponent;
  let fixture: ComponentFixture<CockpittableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CockpittableComponent]
    });
    fixture = TestBed.createComponent(CockpittableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
