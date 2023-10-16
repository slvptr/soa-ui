import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupFiltersComponent } from './study-group-filters.component';

describe('StudyGroupFiltersComponent', () => {
  let component: StudyGroupFiltersComponent;
  let fixture: ComponentFixture<StudyGroupFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudyGroupFiltersComponent]
    });
    fixture = TestBed.createComponent(StudyGroupFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
