import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogContext,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Semester, StudyGroup } from '../../domain/study-group';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputInlineModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { catchError, EMPTY, finalize, takeUntil, tap } from 'rxjs';
import { DetailsService } from './details.service';
import { AppStore } from '../../app-store/store/app.store';

export type StudyGroupDetailsForm = {
  general: FormGroup<{
    id: FormControl<number>;
    groupName: FormControl<string>;
    coordinateX: FormControl<number>;
    coordinateY: FormControl<number>;
    studentsCount: FormControl<number>;
    transferredStudents: FormControl<number>;
    averageMark: FormControl<number>;
    semester: FormControl<Semester>;
    creationDate: FormControl<TuiDay>;
  }>;
  groupAdmin: FormGroup<{
    adminName: FormControl<string>;
    height: FormControl<number>;
    weight: FormControl<number>;
    passportID: FormControl<string>;
    birthday: FormControl<TuiDay>;
  }>;
};

const formControlErrorMessages = {
  groupName: 'Name must be at least 2 characters long',
  coordinates: 'Coordinates must be not null',
  studentsCount: 'StudentsCount must be greater than or equal to 0',
  transferredStudents: 'TransferredStudents must be greater than or equal to 0',
  averageMark: 'AverageMark must be greater than or equal to 0',
  adminName: 'Name must be at least 2 characters long',
  height: 'Height must be greater than or equal to 0',
  weight: 'Weight must be greater than or equal to 0',
  passportID: 'PassportID must be have length of 10',
} as const;

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
    TuiInputNumberModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
  ],
  providers: [DetailsService, TuiDestroyService],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less'],
})
export class DetailsComponent implements OnInit {
  semestersList = Object.values(Semester).filter(item => isNaN(item as any));

  readonly id = this.context.data.studyGroup.id;
  readonly studyGroupData = this.context.data.studyGroup;
  readonly dialogMode = this.context.data.mode;

  readonly creationDate = new Date(this.studyGroupData.creationDate);
  readonly birthdayDate = new Date(this.studyGroupData.groupAdmin.birthday);

  showUpdateLoader = false;
  showDeleteLoader = false;
  showAddLoader = false;

  errorMessages = {
    groupName: null,
    coordinates: null,
    studentsCount: null,
    transferredStudents: null,
    averageMark: null,
    adminName: null,
    height: null,
    weight: null,
    passportID: null,
  };

  constructor(
    private readonly detailsService: DetailsService,
    private readonly store: AppStore,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<StudyGroup, DetailsContextInput>,
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService
  ) {}

  detailsForm = new FormGroup<StudyGroupDetailsForm>({
    general: new FormGroup({
      id: new FormControl(this.studyGroupData.id, {
        nonNullable: true,
      }),
      groupName: new FormControl(this.studyGroupData.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      coordinateX: new FormControl(this.studyGroupData.coordinates.x, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      coordinateY: new FormControl(this.studyGroupData.coordinates.y, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      studentsCount: new FormControl(this.studyGroupData.studentsCount, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      transferredStudents: new FormControl(
        this.studyGroupData.transferredStudents,
        {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }
      ),
      averageMark: new FormControl(this.studyGroupData.averageMark, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      semester: new FormControl(this.studyGroupData.semesterEnum, {
        nonNullable: true,
      }),
      creationDate: new FormControl(
        new TuiDay(
          this.creationDate.getFullYear(),
          this.creationDate.getMonth(),
          this.creationDate.getDate()
        ),
        { nonNullable: true }
      ),
    }),
    groupAdmin: new FormGroup({
      adminName: new FormControl(this.studyGroupData.groupAdmin.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      height: new FormControl(this.studyGroupData.groupAdmin.height, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      weight: new FormControl(this.studyGroupData.groupAdmin.weight, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      passportID: new FormControl(this.studyGroupData.groupAdmin.passportID, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
      birthday: new FormControl(
        new TuiDay(
          this.birthdayDate.getFullYear(),
          this.birthdayDate.getMonth(),
          this.birthdayDate.getDate()
        ),
        { nonNullable: true }
      ),
    }),
  });

  ngOnInit() {
    const generalFormGroup = this.detailsForm.controls.general;
    const adminFormGroup = this.detailsForm.controls.groupAdmin;

    const generalControls = Object.keys(generalFormGroup.controls);
    const adminControls = Object.keys(adminFormGroup.controls);

    generalControls.forEach(key => {
      const control = generalFormGroup.get(key);
      control?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (['coordinateX', 'coordinateY'].includes(key)) {
          key = 'coordinates';
        }
        control?.valid
          ? ((this.errorMessages as any)[key] = null)
          : ((this.errorMessages as any)[key] = (
              formControlErrorMessages as any
            )[key]);
      });
    });

    adminControls.forEach(key => {
      const control = adminFormGroup.get(key);
      control?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        control?.valid
          ? ((this.errorMessages as any)[key] = null)
          : ((this.errorMessages as any)[key] = (
              formControlErrorMessages as any
            )[key]);
      });
    });
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
        catchError(response => {
          this.alertService
            .open(response.error.detail, { status: 'error' })
            .subscribe();

          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(updatedStudyGroup =>
        this.context.completeWith(updatedStudyGroup[0])
      );
  }

  onDelete() {
    this.showDeleteLoader = true;

    this.store
      .deleteStudyGroup(this.studyGroupData.id)
      .pipe(
        finalize(() => (this.showDeleteLoader = false)),
        catchError(response => {
          this.alertService
            .open(response.error.detail, { status: 'error' })
            .subscribe();

          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(deletedStudyGroup =>
        this.context.completeWith(deletedStudyGroup[0])
      );
  }

  onAdd() {
    if (!this.detailsForm.valid) {
      return;
    }

    const studyGroup: StudyGroup = this.detailsService.mapFormToModel(
      this.detailsForm.controls
    );

    this.showAddLoader = true;

    this.store
      .addStudyGroup(studyGroup)
      .pipe(
        finalize(() => (this.showAddLoader = false)),
        catchError(response => {
          this.alertService
            .open(response.error.detail, { status: 'error' })
            .subscribe();

          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(addedStudyGroup =>
        this.context.completeWith(addedStudyGroup[0])
      );
  }
}
