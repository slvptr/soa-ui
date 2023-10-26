import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiDialogContext,
  TuiErrorModule,
  TuiLabelModule,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Semester, StudyGroup } from '../../domain/study-group';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiInputDateModule,
  TuiInputInlineModule,
  TuiInputModule,
} from '@taiga-ui/kit';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { catchError, EMPTY, finalize, takeUntil, tap } from 'rxjs';
import { DetailsService } from './details.service';
import { AppStore } from '../../app-store/store/app.store';

export type StudyGroupDetailsForm = {
  general: FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    coordinateX: FormControl<number>;
    coordinateY: FormControl<number>;
    studentsCount: FormControl<number>;
    transferredStudents: FormControl<number>;
    averageMark: FormControl<number>;
    semester: FormControl<Semester>;
    creationDate: FormControl<TuiDay>;
  }>;
  groupAdmin: FormGroup<{
    name: FormControl<string>;
    height: FormControl<number>;
    weight: FormControl<number>;
    passportID: FormControl<string>;
    birthday: FormControl<TuiDay>;
  }>;
};

export type DetailsContextInput = {
  studyGroup: StudyGroup;
  mode: 'editing' | 'adding';
};

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputInlineModule,
    TuiButtonModule,
    TuiErrorModule,
    TuiInputDateModule,
    TuiInputModule,
  ],
  providers: [DetailsService, TuiDestroyService],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})
export class DetailsComponent implements OnInit {
  readonly studyGroupData = this.context.data.studyGroup;
  readonly dialogMode = this.context.data.mode;

  private readonly creationDate = new Date(this.studyGroupData.creationDate);
  private readonly birthdayDate = new Date(
    this.studyGroupData.groupAdmin.birthday
  );

  isFormChanged: boolean = true;
  showUpdateLoader: boolean = false;
  showDeleteLoader: boolean = false;
  showAddLoader: boolean = false;

  constructor(
    private readonly detailsService: DetailsService,
    private readonly store: AppStore,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<StudyGroup, DetailsContextInput>,
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService
  ) {}

  detailsForm = new FormGroup<StudyGroupDetailsForm>({
    general: new FormGroup({
      id: new FormControl(this.studyGroupData.id, { nonNullable: true }),
      name: new FormControl(this.studyGroupData.name, { nonNullable: true }),
      coordinateX: new FormControl(this.studyGroupData.coordinates.x, {
        nonNullable: true,
      }),
      coordinateY: new FormControl(this.studyGroupData.coordinates.y, {
        nonNullable: true,
      }),
      studentsCount: new FormControl(this.studyGroupData.studentsCount, {
        nonNullable: true,
      }),
      transferredStudents: new FormControl(
        this.studyGroupData.transferredStudents,
        { nonNullable: true }
      ),
      averageMark: new FormControl(this.studyGroupData.averageMark, {
        nonNullable: true,
      }),
      semester: new FormControl(this.studyGroupData.semesterEnum, {
        nonNullable: true,
      }),
      creationDate: new FormControl(
        new TuiDay(
          this.birthdayDate.getFullYear(),
          this.birthdayDate.getMonth(),
          this.birthdayDate.getDay()
        ),
        { nonNullable: true }
      ),
    }),
    groupAdmin: new FormGroup({
      name: new FormControl(this.studyGroupData.groupAdmin.name, {
        nonNullable: true,
      }),
      height: new FormControl(this.studyGroupData.groupAdmin.height, {
        nonNullable: true,
      }),
      weight: new FormControl(this.studyGroupData.groupAdmin.weight, {
        nonNullable: true,
      }),
      passportID: new FormControl(this.studyGroupData.groupAdmin.passportID, {
        nonNullable: true,
      }),
      birthday: new FormControl(
        new TuiDay(
          this.birthdayDate.getFullYear(),
          this.birthdayDate.getMonth(),
          this.birthdayDate.getDay()
        ),
        { nonNullable: true }
      ),
    }),
  });

  detectFormChanges() {
    // this.detailsForm.valueChanges
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.isFormChanged = true;
    //   });
  }

  ngOnInit() {
    this.detectFormChanges();
  }

  onUpdate() {
    const studyGroup: StudyGroup = this.detailsService.mapFormToModel(
      this.detailsForm.controls
    );

    this.showUpdateLoader = true;

    this.store
      .updateStudyGroup(studyGroup)
      .pipe(
        finalize(() => (this.showUpdateLoader = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(updatedStudyGroup =>
        this.context.completeWith(updatedStudyGroup)
      );
  }

  onDelete() {
    this.showDeleteLoader = true;

    this.store
      .deleteStudyGroup(this.studyGroupData.id)
      .pipe(
        finalize(() => (this.showDeleteLoader = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(deletedStudyGroup =>
        this.context.completeWith(deletedStudyGroup)
      );
  }

  onAdd() {
    const studyGroup: StudyGroup = this.detailsService.mapFormToModel(
      this.detailsForm.controls
    );

    this.showAddLoader = true;

    this.store
      .addStudyGroup(studyGroup)
      .pipe(
        finalize(() => (this.showAddLoader = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(addedStudyGroup => this.context.completeWith(addedStudyGroup));
  }
}
