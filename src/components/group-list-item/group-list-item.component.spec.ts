import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListItemComponent } from './group-list-item.component';

describe('StudyGroupListItemComponent', () => {
  let component: GroupListItemComponent;
  let fixture: ComponentFixture<GroupListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GroupListItemComponent],
    });
    fixture = TestBed.createComponent(GroupListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
