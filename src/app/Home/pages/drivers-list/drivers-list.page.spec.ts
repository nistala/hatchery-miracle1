import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriversListPage } from './drivers-list.page';

describe('DriversListPage', () => {
  let component: DriversListPage;
  let fixture: ComponentFixture<DriversListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
