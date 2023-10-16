import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiIslandModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintModule, TuiSvgModule } from '@taiga-ui/core';
import { Semester } from '../../domain/study-group';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';
import { tuiIconRefreshCcwLarge } from '@taiga-ui/icons';
import { Filters } from '../../domain/controls';
import { DateUtils } from '../../utils/date-utils';
import { StudyGroupListStore } from '../../study-group-list-store/store/study-group-list.store';
import { provideComponentStore } from '@ngrx/component-store';

type FiltersForm = {
  id: FormControl<number>;
  groupName: FormControl<string>;
  coordinateX: FormControl<number>;
  coordinateY: FormControl<number>;
  studentsCount: FormControl<number>;
  transferredStudents: FormControl<number>;
  averageMark: FormControl<number>;
  adminName: FormControl<string>;
  semester: FormControl<number>;
  creationDate: FormControl<TuiDay>;
};

@Component({
  selector: 'soa-study-group-filters',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiInputModule,
    TuiHintModule,
    TuiInputDateModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiSvgModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
  templateUrl: './study-group-filters.component.html',
  styleUrls: ['./study-group-filters.component.less'],
})
export class StudyGroupFiltersComponent implements OnInit {
  semestersList = Object.values(Semester).filter(item => !isNaN(item as any));

  filtersForm = new FormGroup<FiltersForm>({
    id: new FormControl(),
    groupName: new FormControl(),
    coordinateX: new FormControl(),
    coordinateY: new FormControl(),
    studentsCount: new FormControl(),
    transferredStudents: new FormControl(),
    averageMark: new FormControl(),
    adminName: new FormControl(),
    semester: new FormControl(),
    creationDate: new FormControl(),
  });

  constructor(
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService,
    private readonly studyGroupListStore: StudyGroupListStore
  ) {}

  ngOnInit() {
    this.detectFormChanges();
  }

  detectFormChanges() {
    this.filtersForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        const filters: Filters = {
          id: values.id ?? undefined,
          groupName: values.groupName ?? undefined,
          coordinateX: values.coordinateX ?? undefined,
          coordinateY: values.coordinateY ?? undefined,
          studentsCount: values.studentsCount ?? undefined,
          transferredStudents: values.transferredStudents ?? undefined,
          averageMark: values.transferredStudents ?? undefined,
          adminName: values.adminName ?? undefined,
          semester: values.semester ?? undefined,
          creationDate: values.creationDate
            ? DateUtils.tuiDayToISO(values.creationDate)
            : undefined,
        };

        this.studyGroupListStore.setFilters(filters);
      });
  }

  onRefresh() {
    this.filtersForm.reset();
  }

  protected readonly tuiIconRefreshCcwLarge = tuiIconRefreshCcwLarge;
}
