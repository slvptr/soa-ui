import { Component, Inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiIslandModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiGroupModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { DetailsComponent } from '../details/details.component';
import { takeUntil } from 'rxjs';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { PrimaryActionsService } from './primary-actions.service';
import { AppStore } from '../../app-store/store/app.store';

type AverageMarkForm = {
  averageMark: FormControl<number | null>;
};

type TransferredStudentsForm = {
  transferredStudents: FormControl<number | null>;
};

@Component({
  selector: 'app-primary-actions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiIslandModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiInputModule,
    TuiGroupModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
  ],
  templateUrl: './primary-actions.component.html',
  styleUrls: ['./primary-actions.component.less'],
  providers: [TuiDestroyService, PrimaryActionsService],
})
export class PrimaryActionsComponent {
  averageMarkForm = new FormGroup<AverageMarkForm>({
    averageMark: new FormControl(null, [Validators.required]),
  });

  transferredStudentsForm = new FormGroup<TransferredStudentsForm>({
    transferredStudents: new FormControl(null, [Validators.required]),
  });

  actions$ = this.store.primaryActions$;

  constructor(
    private readonly store: AppStore,
    private readonly actionsService: PrimaryActionsService,
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  onDeleteButtonClick() {
    const formValue = this.averageMarkForm.getRawValue();

    if (this.averageMarkForm.valid && formValue.averageMark !== null) {
      this.store.deleteAllByAverageMark(formValue.averageMark).subscribe();
    }
  }

  onGetGroupsTransferredLessButtonClick() {
    const formValue = this.transferredStudentsForm.getRawValue();

    if (
      this.transferredStudentsForm.valid &&
      formValue.transferredStudents !== null
    ) {
      this.store
        .getGroupsWithTransferredLess(formValue.transferredStudents)
        .subscribe();
    }
  }

  onGetGroupSmallestCoordinateButtonClick() {
    this.store.getGroupWithSmallestCoordinates().subscribe();
  }

  onAddButtonClick() {
    this.dialogService
      .open(new PolymorpheusComponent(DetailsComponent, this.injector), {
        data: {
          studyGroup: this.actionsService.createEmptyStudyGroup(),
          mode: 'adding',
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
