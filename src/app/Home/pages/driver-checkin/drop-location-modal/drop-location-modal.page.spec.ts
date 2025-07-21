import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropLocationModalPage } from './drop-location-modal.page';

describe('DropLocationModalPage', () => {
  let component: DropLocationModalPage;
  let fixture: ComponentFixture<DropLocationModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DropLocationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
