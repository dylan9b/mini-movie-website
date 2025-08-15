import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastVisitedComponent } from './last-visited.component';

describe('LastVisitedComponent', () => {
  let component: LastVisitedComponent;
  let fixture: ComponentFixture<LastVisitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastVisitedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastVisitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
