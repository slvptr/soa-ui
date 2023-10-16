import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyGroupListSkeletonComponent } from './study-group-list-skeleton.component';

describe('StudyGroupListSkeletonComponent', () => {
  let component: StudyGroupListSkeletonComponent;
  let fixture: ComponentFixture<StudyGroupListSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudyGroupListSkeletonComponent]
    });
    fixture = TestBed.createComponent(StudyGroupListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
