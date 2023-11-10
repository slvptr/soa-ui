import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryActionsComponent } from './secondary-actions.component';

describe('StudyGroupActionsComponent', () => {
  let component: SecondaryActionsComponent;
  let fixture: ComponentFixture<SecondaryActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SecondaryActionsComponent],
    });
    fixture = TestBed.createComponent(SecondaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
