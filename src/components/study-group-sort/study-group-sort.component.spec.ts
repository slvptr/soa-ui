import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupSortComponent } from './study-group-sort.component';

describe('StudyGroupSortComponent', () => {
  let component: StudyGroupSortComponent;
  let fixture: ComponentFixture<StudyGroupSortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudyGroupSortComponent]
    });
    fixture = TestBed.createComponent(StudyGroupSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
