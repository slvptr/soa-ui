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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppStore } from '../../app-store/store/app.store';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { DetailsComponent } from '../details/details.component';
import { takeUntil } from 'rxjs';
import { PrimaryActionsService } from '../primary-actions/primary-actions.service';

type MoveStudentsForm = {
  from: FormControl<string | null>;
  to: FormControl<string | null>;
};

@Component({
  selector: 'app-secondary-actions',
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
  templateUrl: './secondary-actions.component.html',
  styleUrls: ['./secondary-actions.component.less'],
  providers: [TuiDestroyService],
})
export class SecondaryActionsComponent {
  moveStudentsForm = new FormGroup<MoveStudentsForm>({
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
  });

  readonly actions$ = this.store.secondaryActions$;

  constructor(
    private readonly store: AppStore,
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector
  ) {}

  onMoveButtonClick() {
    const formValue = this.moveStudentsForm.getRawValue();

    if (
      this.moveStudentsForm.valid &&
      formValue.from !== null &&
      formValue.to !== null
    ) {
      this.store.moveStudents(formValue.from, formValue.to).subscribe();
    }
  }

  onCountButtonClick() {
    this.store.countTransferred().subscribe();
  }
}
