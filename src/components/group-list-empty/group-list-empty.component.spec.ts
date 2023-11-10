import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupListEmptyComponent } from './group-list-empty.component';

describe('GroupListEmptyComponent', () => {
  let component: GroupListEmptyComponent;
  let fixture: ComponentFixture<GroupListEmptyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GroupListEmptyComponent]
    });
    fixture = TestBed.createComponent(GroupListEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
