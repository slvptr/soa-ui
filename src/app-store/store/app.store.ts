import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { StudyGroup } from '../../domain/study-group';
import { StudyGroupService } from '../data-access/study-group.service';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  EMPTY,
  interval,
  map,
  skipWhile,
  switchMap,
  tap,
  throttleTime,
  throwError,
  timer,
  withLatestFrom,
} from 'rxjs';
import {
  Actions,
  Filters,
  Pagination,
  SortCriteria,
  SortOrder,
  SortParams,
} from '../../domain/controls';
import { ActionsService } from '../data-access/actions.service';

export interface StudyGroupListState {
  studyGroupList: StudyGroup[];
  pagination: Pagination;
  filters: Filters;
  actions: Actions;
  sortParams: SortParams;
  status: DataStatus;
  initialized: boolean;
  error?: string;
}

export enum DataStatus {
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}

const initialState: StudyGroupListState = {
  studyGroupList: [],
  pagination: {
    index: 0,
    length: 0,
  },
  filters: {},
  actions: {
    move: {
      isLoading: false,
    },
    count: {
      isLoading: false,
    },
  },
  sortParams: {
    criteria: SortCriteria.Id,
    order: SortOrder.Default,
  },
  status: DataStatus.Loading,
  initialized: false,
};

@Injectable()
export class AppStore
  extends ComponentStore<StudyGroupListState>
  implements OnStateInit, OnStoreInit
{
  private readonly studyGroupService = inject(StudyGroupService);
  private readonly actionsService = inject(ActionsService);

  readonly studyGroupList$ = this.select(state => state.studyGroupList);
  readonly status$ = this.select(state => state.status);
  readonly error$ = this.select(state => state.error);
  readonly pagination$ = this.select(state => state.pagination);
  readonly filters$ = this.select(state => state.filters);
  readonly sortParams$ = this.select(state => state.sortParams);
  readonly actions$ = this.select(state => state.actions);
  readonly initialized$ = this.select(state => state.initialized);

  private readonly fetchParams$ = combineLatest([
    this.filters$,
    this.sortParams$,
    this.pagination$,
  ]);

  private readonly setListLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      status: isLoading ? DataStatus.Loading : DataStatus.Loaded,
    })
  );

  private readonly setMoveActionLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      actions: {
        move: { isLoading },
        count: state.actions.count,
      },
    })
  );

  private readonly setCountActionLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      actions: {
        move: state.actions.move,
        count: {
          value: state.actions.count.value,
          isLoading,
        },
      },
    })
  );

  private readonly setCountActionValue = this.updater(
    (state, value: number) => ({
      ...state,
      actions: {
        move: state.actions.move,
        count: {
          isLoading: state.actions.count.isLoading,
          value,
        },
      },
    })
  );

  private readonly setStudyGroup = this.updater(
    (state, studyGroup: StudyGroup) => {
      const oldStudyGroup = state.studyGroupList.find(
        ({ id }) => id === studyGroup.id
      );
      const idx = state.studyGroupList.indexOf(oldStudyGroup!);

      const newState = structuredClone(state);
      newState.studyGroupList[idx] = studyGroup;

      return newState;
    }
  );

  readonly setFilters = this.updater((state, filters: Filters) => ({
    ...state,
    filters,
    initialized: true,
  }));

  readonly setSortParams = this.updater((state, sortParams: SortParams) => ({
    ...state,
    sortParams,
    initialized: true,
  }));

  readonly setPaginationIndex = this.updater((state, index: number) => ({
    ...state,
    pagination: {
      index,
      length: state.pagination.length,
    },
    initialized: true,
  }));

  readonly moveStudents = (fromGroup: string, toGroup: string) => {
    this.setMoveActionLoading(true);

    return this.actionsService.moveStudents(fromGroup, toGroup).pipe(
      tapResponse({
        next: response => {
          this.updateStudyGroupList(
            initialState.filters,
            initialState.sortParams
          ).subscribe();
        },
        error: err => console.error(err),
        finalize: () => this.setMoveActionLoading(false),
      })
    );
  };

  readonly countExpelled = () => {
    this.setCountActionLoading(true);

    return this.actionsService.countExpelled().pipe(
      tapResponse({
        next: response => {
          this.setCountActionValue(response.numberOfExpelledStudents);
        },
        error: err => console.error(err),
        finalize: () => this.setCountActionLoading(false),
      })
    );
  };

  readonly updateStudyGroup = (studyGroup: StudyGroup) =>
    this.studyGroupService
      .updateStudyGroup(studyGroup)
      .pipe(
        tap(() =>
          this.updateStudyGroupList(
            initialState.filters,
            initialState.sortParams
          ).subscribe()
        )
      );

  readonly deleteStudyGroup = (id: number) =>
    this.studyGroupService
      .deleteStudyGroup(id)
      .pipe(
        tap(() =>
          this.updateStudyGroupList(
            initialState.filters,
            initialState.sortParams
          ).subscribe()
        )
      );

  readonly addStudyGroup = (studyGroup: StudyGroup) =>
    this.studyGroupService
      .addStudyGroup(studyGroup)
      .pipe(
        tap(() =>
          this.updateStudyGroupList(
            initialState.filters,
            initialState.sortParams
          ).subscribe()
        )
      );

  private readonly updateStudyGroupList = (
    filters: Filters,
    sortParams: SortParams,
    pagination?: Pagination
  ) => {
    this.setListLoading(true);

    return this.studyGroupService
      .loadStudyGroupList(filters, sortParams, pagination)
      .pipe(
        tapResponse({
          next: response => {
            const updatedStateBase = {
              studyGroupList: response.studyGroupList,
              status: DataStatus.Loaded,
            };
            return pagination
              ? this.patchState(updatedStateBase)
              : this.patchState({
                  ...updatedStateBase,
                  pagination: {
                    index: response.page,
                    length: response.totalPages,
                  },
                });
          },
          error: () =>
            this.patchState({
              status: DataStatus.Error,
            }),
        })
      );
  };

  private fetchListOnParamsChange = this.effect(_ =>
    this.fetchParams$.pipe(
      throttleTime(300),
      withLatestFrom(this.initialized$),
      skipWhile(([_, initialized]) => initialized === false),
      switchMap(([[filters, sortParams, pagination], _]) =>
        this.updateStudyGroupList(filters, sortParams, pagination)
      )
    )
  );

  ngrxOnStoreInit(): void {
    this.setState(initialState);
  }

  ngrxOnStateInit(): void {
    this.updateStudyGroupList(
      initialState.filters,
      initialState.sortParams
    ).subscribe();
  }
}
