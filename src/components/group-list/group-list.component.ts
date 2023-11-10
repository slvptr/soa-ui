import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { DataStatus, AppStore } from '../../app-store/store/app.store';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { GroupListSkeletonComponent } from '../group-list-skeleton/group-list-skeleton.component';
import { StudyGroup } from '../../domain/study-group';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { DetailsComponent } from '../details/details.component';
import { takeUntil } from 'rxjs';
import { SortBarComponent } from '../sort-bar/sort-bar.component';
import { GroupListEmptyComponent } from '../group-list-empty/group-list-empty.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    CommonModule,
    GroupListItemComponent,
    TuiLetModule,
    TuiPaginationModule,
    GroupListSkeletonComponent,
    SortBarComponent,
    GroupListEmptyComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.less'],
  providers: [TuiDestroyService],
})
export class GroupListComponent {
  protected readonly DataStatus = DataStatus;

  readonly studyGroupList$ = this.store.studyGroupList$;
  readonly status$ = this.store.status$;
  readonly pagination$ = this.store.pagination$;

  navigateToPage(index: number): void {
    this.store.updatePaginationIndex(index).subscribe();
  }

  onItemClick(studyGroup: StudyGroup) {
    this.dialogService
      .open(new PolymorpheusComponent(DetailsComponent, this.injector), {
        data: { studyGroup, mode: 'editing' },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  constructor(
    private readonly store: AppStore,
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}
}
