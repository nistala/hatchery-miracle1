import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundDetailsPage } from './round-details.page';

describe('RoundDetailsPage', () => {
  let component: RoundDetailsPage;
  let fixture: ComponentFixture<RoundDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
