import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiRadioBlockModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiGroupModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';
import { AppStore } from '../../app-store/store/app.store';
import { SortCriteria, SortOrder } from '../../domain/controls';

@Component({
  selector: 'app-sort-bar',
  standalone: true,
  imports: [
    CommonModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    ReactiveFormsModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    TuiTextfieldControllerModule,
  ],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.less'],
})
export class SortBarComponent implements OnInit {
  sortItems = Object.values(SortCriteria);

  sortForm = new FormGroup({
    criteria: new FormControl(SortCriteria.Id),
    order: new FormControl(SortOrder.Default),
  });

  constructor(
    @Inject(TuiDestroyService)
    private readonly destroy$: TuiDestroyService,
    private readonly store: AppStore
  ) {}

  ngOnInit() {
    this.detectFormChanges();
  }

  detectFormChanges() {
    this.sortForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ criteria, order }) => {
        if (criteria && order) {
          this.store.setSortParams({ criteria, order });
        }
      });
  }
}
