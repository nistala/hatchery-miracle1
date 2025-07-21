import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverCheckinPage } from './driver-checkin.page';

describe('DriverCheckinPage', () => {
  let component: DriverCheckinPage;
  let fixture: ComponentFixture<DriverCheckinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverCheckinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
