import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerRegisterPage } from './owner-register.page';

describe('OwnerRegisterPage', () => {
  let component: OwnerRegisterPage;
  let fixture: ComponentFixture<OwnerRegisterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
