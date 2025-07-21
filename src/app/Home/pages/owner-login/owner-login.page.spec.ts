import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerLoginPage } from './owner-login.page';

describe('OwnerLoginPage', () => {
  let component: OwnerLoginPage;
  let fixture: ComponentFixture<OwnerLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
