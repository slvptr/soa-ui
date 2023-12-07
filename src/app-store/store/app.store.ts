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
  auditTime,
  combineLatest,
  switchMap,
  take,
  tap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import {
  SecondaryActions,
  Filters,
  Pagination,
  SortCriteria,
  SortOrder,
  SortParams,
  PrimaryActions,
} from '../../domain/controls';
import { ActionsService } from '../data-access/actions.service';

export interface StudyGroupListState {
  studyGroupList: StudyGroup[];
  pagination: Pagination;
  filters: Filters;
  primaryActions: PrimaryActions;
  secondaryActions: SecondaryActions;
  sortParams: SortParams;
  status: DataStatus;
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
    totalCount: 0,
  },
  filters: {},
  primaryActions: {
    delete: {
      isLoading: false,
    },
    getGroupWithSmallestCoordinate: {
      isLoading: false,
    },
    getGroupsWithTransferredLess: {
      isLoading: false,
    },
  },
  secondaryActions: {
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
  readonly primaryActions$ = this.select(state => state.primaryActions);
  readonly secondaryActions$ = this.select(state => state.secondaryActions);

  private readonly fetchParams$ = combineLatest([
    this.filters$,
    this.sortParams$,
    this.pagination$,
  ]);

  private readonly onChangeEffectParams$ = combineLatest([
    this.filters$,
    this.sortParams$,
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
      secondaryActions: {
        move: { isLoading },
        count: state.secondaryActions.count,
      },
    })
  );

  private readonly setCountActionLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      secondaryActions: {
        move: state.secondaryActions.move,
        count: {
          value: state.secondaryActions.count.value,
          isLoading,
        },
      },
    })
  );

  private readonly setDeleteByAverageMarkActionLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      primaryActions: {
        ...state.primaryActions,
        delete: {
          value: state.primaryActions.delete.value,
          isLoading,
        },
      },
    })
  );

  private readonly setGroupsWithTransferredLessLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      primaryActions: {
        ...state.primaryActions,
        getGroupsWithTransferredLess: {
          value: state.primaryActions.getGroupsWithTransferredLess.value,
          isLoading,
        },
      },
    })
  );

  private readonly setGroupWithSmallestCoordinateLoading = this.updater(
    (state, isLoading: boolean) => ({
      ...state,
      primaryActions: {
        ...state.primaryActions,
        getGroupWithSmallestCoordinate: {
          isLoading,
        },
      },
    })
  );

  private readonly setCountActionValue = this.updater(
    (state, value: number) => ({
      ...state,
      secondaryActions: {
        move: state.secondaryActions.move,
        count: {
          isLoading: state.secondaryActions.count.isLoading,
          value,
        },
      },
    })
  );

  readonly setFilters = this.updater((state, filters: Filters) => ({
    ...state,
    filters,
  }));

  readonly setSortParams = this.updater((state, sortParams: SortParams) => ({
    ...state,
    sortParams,
  }));

  readonly setPaginationIndex = this.updater((state, index: number) => ({
    ...state,
    pagination: {
      ...state.pagination,
      index,
    },
  }));

  readonly updatePaginationIndex = (index: number) => {
    this.setPaginationIndex(index);

    return this.fetchParams$.pipe(
      tapResponse({
        next: ([filters, sortParams, pagination]) => {
          this.updateStudyGroupList(
            filters,
            sortParams,
            pagination
          ).subscribe();
        },
        error: err => console.error(err),
      }),
      take(1)
    );
  };

  readonly moveStudents = (fromGroup: string, toGroup: string) => {
    this.setMoveActionLoading(true);

    return this.actionsService.moveStudents(fromGroup, toGroup).pipe(
      withLatestFrom(this.fetchParams$),
      tapResponse({
        next: ([_, [filters, sortParams, pagination]]) => {
          this.updateStudyGroupList(
            filters,
            sortParams,
            pagination
          ).subscribe();
        },
        error: err => {
          throw new Error();
        },
        finalize: () => this.setMoveActionLoading(false),
      })
    );
  };

  readonly countTransferred = () => {
    this.setCountActionLoading(true);

    return this.actionsService.countTransferred().pipe(
      tapResponse({
        next: response => {
          this.setCountActionValue(response);
        },
        error: err => console.error(err),
        finalize: () => this.setCountActionLoading(false),
      })
    );
  };

  readonly deleteAllByAverageMark = (averageMark: number) => {
    this.setDeleteByAverageMarkActionLoading(true);

    return this.studyGroupService.deleteAllByAverageMark(averageMark).pipe(
      auditTime(400),
      withLatestFrom(this.fetchParams$),
      tapResponse({
        next: ([_, [filters, sortParams, pagination]]) =>
          this.updateStudyGroupList(
            filters,
            sortParams,
            pagination
          ).subscribe(),
        error: err => console.error(err),
        finalize: () => this.setDeleteByAverageMarkActionLoading(false),
      })
    );
  };

  readonly getGroupsWithTransferredLess = (transferredStudents: number) => {
    this.setGroupsWithTransferredLessLoading(true);
    this.setListLoading(true);

    return this.studyGroupService
      .getGroupsWithTransferredStudentsLessThan(transferredStudents)
      .pipe(
        auditTime(400),
        tapResponse({
          next: list => {
            this.patchState({
              studyGroupList: list,
              status: DataStatus.Loaded,
              pagination: {
                index: 0,
                length: 1,
                totalCount: list.length,
              },
            });
          },
          error: err => console.error(err),
          finalize: () => this.setGroupsWithTransferredLessLoading(false),
        })
      );
  };

  readonly getGroupWithSmallestCoordinates = () => {
    this.setGroupWithSmallestCoordinateLoading(true);
    this.setListLoading(true);

    return this.studyGroupService.getGroupWithSmallestCoordinate().pipe(
      auditTime(400),
      tapResponse({
        next: studyGroup => {
          this.patchState({
            studyGroupList: [studyGroup],
            status: DataStatus.Loaded,
            pagination: {
              index: 0,
              length: 1,
              totalCount: 1,
            },
          });
        },
        error: err => console.error(err),
        finalize: () => this.setGroupWithSmallestCoordinateLoading(false),
      })
    );
  };

  readonly updateStudyGroup = (studyGroup: StudyGroup) =>
    this.studyGroupService.updateStudyGroup(studyGroup).pipe(
      withLatestFrom(this.fetchParams$),
      tap(([_, [filters, sortParams, pagination]]) =>
        this.updateStudyGroupList(filters, sortParams, pagination).subscribe()
      )
    );

  readonly deleteStudyGroup = (id: number) =>
    this.studyGroupService.deleteStudyGroup(id).pipe(
      withLatestFrom(this.fetchParams$, this.studyGroupList$),
      tap(([_, [filters, sortParams, pagination], list]) => {
        if (list.length === 1) {
          pagination.index = Math.max(pagination.index - 1, 0);
        }
        this.updateStudyGroupList(filters, sortParams, pagination).subscribe();
      })
    );

  readonly addStudyGroup = (studyGroup: StudyGroup) =>
    this.studyGroupService.addStudyGroup(studyGroup).pipe(
      withLatestFrom(this.fetchParams$),
      tap(([_, [filters, sortParams, pagination]]) =>
        this.updateStudyGroupList(filters, sortParams, pagination).subscribe()
      )
    );

  private readonly updateStudyGroupList = (
    filters: Filters,
    sortParams: SortParams,
    pagination: Pagination
  ) => {
    this.setListLoading(true);

    return this.studyGroupService
      .loadStudyGroupList(filters, sortParams, pagination)
      .pipe(
        auditTime(400),
        tapResponse({
          next: response =>
            this.patchState({
              studyGroupList: response.studyGroups,
              status: DataStatus.Loaded,
              pagination: {
                index: response.page,
                length: response.totalPages,
                totalCount: response.totalCount,
              },
            }),
          error: () =>
            this.patchState({
              status: DataStatus.Error,
            }),
        })
      );
  };

  private fetchListOnParamsChange = this.effect(_ =>
    this.onChangeEffectParams$.pipe(
      withLatestFrom(this.pagination$),
      switchMap(([[filters, sortParams], pagination]) =>
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
      initialState.sortParams,
      initialState.pagination
    ).subscribe();
  }
}
