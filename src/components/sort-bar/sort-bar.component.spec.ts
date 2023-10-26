import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortBarComponent } from './sort-bar.component';

describe('StudyGroupSortComponent', () => {
  let component: SortBarComponent;
  let fixture: ComponentFixture<SortBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SortBarComponent],
    });
    fixture = TestBed.createComponent(SortBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
