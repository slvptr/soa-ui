import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyGroupListItemComponent } from '../study-group-list-item/study-group-list-item.component';
import {
  DataStatus,
  StudyGroupListStore,
} from '../../study-group-list-store/store/study-group-list.store';
import { provideComponentStore } from '@ngrx/component-store';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { StudyGroupListSkeletonComponent } from '../study-group-list-skeleton/study-group-list-skeleton.component';
import { StudyGroup } from '../../domain/study-group';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { StudyGroupDetailsComponent } from '../study-group-details/study-group-details.component';
import { takeUntil } from 'rxjs';
import { StudyGroupSortComponent } from '../study-group-sort/study-group-sort.component';

@Component({
  selector: 'soa-study-group-list',
  standalone: true,
  imports: [
    CommonModule,
    StudyGroupListItemComponent,
    TuiLetModule,
    TuiPaginationModule,
    StudyGroupListSkeletonComponent,
    StudyGroupSortComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './study-group-list.component.html',
  styleUrls: ['./study-group-list.component.less'],
  providers: [TuiDestroyService],
})
export class StudyGroupListComponent {
  protected readonly DataStatus = DataStatus;

  readonly studyGroupList$ = this.studyGroupListStore.studyGroupList$;
  readonly status$ = this.studyGroupListStore.status$;
  readonly pagination$ = this.studyGroupListStore.pagination$;

  navigateToPage(index: number): void {
    this.studyGroupListStore.setPaginationIndex(index);
  }

  onItemClick(studyGroup: StudyGroup) {
    this.dialogService
      .open(
        new PolymorpheusComponent(StudyGroupDetailsComponent, this.injector),
        {
          data: studyGroup,
        }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedStudyGroup => {
        this.studyGroupListStore.updateStudyGroup(updatedStudyGroup as any);
      });
  }

  constructor(
    private readonly studyGroupListStore: StudyGroupListStore,
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}
}
