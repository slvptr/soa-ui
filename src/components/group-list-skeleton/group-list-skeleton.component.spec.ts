import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListSkeletonComponent } from './group-list-skeleton.component';

describe('StudyGroupListSkeletonComponent', () => {
  let component: GroupListSkeletonComponent;
  let fixture: ComponentFixture<GroupListSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GroupListSkeletonComponent],
    });
    fixture = TestBed.createComponent(GroupListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
