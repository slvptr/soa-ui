import { TuiRootModule, TuiDialogModule, TuiAlertModule } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from '../components/group-list/group-list.component';
import { HttpClient } from '@angular/common/http';
import { FiltersComponent } from '../components/filters/filters.component';
import { ActionsComponent } from '../components/actions/actions.component';
import { SortBarComponent } from '../components/sort-bar/sort-bar.component';
import { provideComponentStore } from '@ngrx/component-store';
import { AppStore } from '../app-store/store/app.store';

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
    ActionsComponent,
    SortBarComponent,
  ],
  providers: [provideComponentStore(AppStore)],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {}
