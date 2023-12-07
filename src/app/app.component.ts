import { TuiRootModule, TuiDialogModule, TuiAlertModule } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from '../components/group-list/group-list.component';
import { FiltersComponent } from '../components/filters/filters.component';
import { SecondaryActionsComponent } from '../components/secondary-actions/secondary-actions.component';
import { SortBarComponent } from '../components/sort-bar/sort-bar.component';
import { provideComponentStore } from '@ngrx/component-store';
import { AppStore } from '../app-store/store/app.store';
import { PrimaryActionsComponent } from '../components/primary-actions/primary-actions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    GroupListComponent,
    FiltersComponent,
    SecondaryActionsComponent,
    SortBarComponent,
    PrimaryActionsComponent,
  ],
  providers: [provideComponentStore(AppStore)],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {}
