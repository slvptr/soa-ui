import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiGroupModule,
  TuiLabelModule,
  TuiPrimitiveTextfieldModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppStore } from '../../app-store/store/app.store';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { DetailsComponent } from '../details/details.component';
import { takeUntil } from 'rxjs';
import { ActionsService } from './actions.service';

type MoveStudentsForm = {
  from: FormControl<string>;
  to: FormControl<string>;
};

@Component({
  selector: 'soa-actions',
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
    TuiTextfieldControllerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.less'],
  providers: [TuiDestroyService, ActionsService],
})
export class ActionsComponent {
  moveStudentsForm = new FormGroup<MoveStudentsForm>({
    from: new FormControl(),
    to: new FormControl(),
  });

  readonly actions$ = this.store.actions$;

  constructor(
    private readonly actionsService: ActionsService,
    private readonly store: AppStore,
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  onMoveButtonClick() {
    const formValue = this.moveStudentsForm.getRawValue();
    this.store.moveStudents(formValue.from, formValue.to).subscribe();
  }

  onCountButtonClick() {
    this.store.countExpelled().subscribe();
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
