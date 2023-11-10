import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryActionsComponent } from './primary-actions.component';

describe('PrimaryActionsComponent', () => {
  let component: PrimaryActionsComponent;
  let fixture: ComponentFixture<PrimaryActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrimaryActionsComponent]
    });
    fixture = TestBed.createComponent(PrimaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
