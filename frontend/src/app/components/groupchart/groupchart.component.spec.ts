import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupchartComponent } from './groupchart.component';

describe('GroupchartComponent', () => {
  let component: GroupchartComponent;
  let fixture: ComponentFixture<GroupchartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupchartComponent]
    });
    fixture = TestBed.createComponent(GroupchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
