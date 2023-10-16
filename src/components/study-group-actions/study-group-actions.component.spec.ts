import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupActionsComponent } from './study-group-actions.component';

describe('StudyGroupActionsComponent', () => {
  let component: StudyGroupActionsComponent;
  let fixture: ComponentFixture<StudyGroupActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudyGroupActionsComponent]
    });
    fixture = TestBed.createComponent(StudyGroupActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
