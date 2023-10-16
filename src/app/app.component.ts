import { TuiRootModule, TuiDialogModule, TuiAlertModule } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyGroupListComponent } from '../components/study-group-list/study-group-list.component';
import { HttpClient } from '@angular/common/http';
import { StudyGroupFiltersComponent } from '../components/study-group-filters/study-group-filters.component';
import { StudyGroupActionsComponent } from '../components/study-group-actions/study-group-actions.component';
import { StudyGroupSortComponent } from '../components/study-group-sort/study-group-sort.component';
import { provideComponentStore } from '@ngrx/component-store';
import { StudyGroupListStore } from '../study-group-list-store/store/study-group-list.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    StudyGroupListComponent,
    StudyGroupFiltersComponent,
    StudyGroupActionsComponent,
    StudyGroupSortComponent,
  ],
  providers: [provideComponentStore(StudyGroupListStore)],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {}
