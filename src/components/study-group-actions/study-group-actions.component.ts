import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiGroupModule,
  TuiLabelModule,
  TuiPrimitiveTextfieldModule,
} from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudyGroupListStore } from '../../study-group-list-store/store/study-group-list.store';
import { TuiLetModule } from '@taiga-ui/cdk';

type MoveStudentsForm = {
  from: FormControl<string>;
  to: FormControl<string>;
};

@Component({
  selector: 'soa-study-group-actions',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiButtonModule,
    TuiInputModule,
    TuiGroupModule,
    TuiLabelModule,
    TuiPrimitiveTextfieldModule,
    ReactiveFormsModule,
    TuiLetModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './study-group-actions.component.html',
  styleUrls: ['./study-group-actions.component.less'],
})
export class StudyGroupActionsComponent {
  moveStudentsForm = new FormGroup<MoveStudentsForm>({
    from: new FormControl(),
    to: new FormControl(),
  });

  readonly actions$ = this.studyGroupListStore.actions$;

  constructor(private readonly studyGroupListStore: StudyGroupListStore) {}

  onMoveButtonClick() {
    const formValue = this.moveStudentsForm.getRawValue();
    this.studyGroupListStore
      .moveStudents(formValue.from, formValue.to)
      .subscribe();
  }

  onCountButtonClick() {
    this.studyGroupListStore.countExpelled().subscribe();
  }
}
