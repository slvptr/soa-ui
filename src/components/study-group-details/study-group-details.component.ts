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
import { StudyGroup } from '../../domain/study-group';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiInputDateModule, TuiInputInlineModule } from '@taiga-ui/kit';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';
import {
  StudyGroupDetailsForm,
  StudyGroupDetailsService,
} from './study-group-details.service';

@Component({
  selector: 'app-study-group-details',
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StudyGroupDetailsService],
  templateUrl: './study-group-details.component.html',
  styleUrls: ['./study-group-details.component.less'],
})
export class StudyGroupDetailsComponent implements OnInit {
  readonly studyGroupData = this.context.data;

  private readonly creationDate = new Date(this.studyGroupData.creationDate);
  private readonly birthdayDate = new Date(
    this.studyGroupData.groupAdmin.birthday
  );

  isFormChanged: boolean = false;

  constructor(
    private readonly studyGroupDetailsService: StudyGroupDetailsService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<StudyGroup, StudyGroup>,
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
    this.detailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isFormChanged = true;
      });
  }

  ngOnInit() {
    this.detectFormChanges();
  }

  onSubmit() {
    this.context.completeWith(
      this.studyGroupDetailsService.mapFormToModel(this.detailsForm.controls)
    );
  }
}
