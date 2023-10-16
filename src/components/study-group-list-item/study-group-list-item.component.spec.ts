import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupListItemComponent } from './study-group-list-item.component';

describe('StudyGroupListItemComponent', () => {
  let component: StudyGroupListItemComponent;
  let fixture: ComponentFixture<StudyGroupListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudyGroupListItemComponent]
    });
    fixture = TestBed.createComponent(StudyGroupListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
