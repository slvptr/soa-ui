import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throttle, throttleTime, timer } from 'rxjs';
import { StudyGroup } from '../../domain/study-group';
import { studyGroupListMock } from './study-group.mock';
import { Filters, Pagination, SortParams } from '../../domain/controls';

export interface StudyGroupListApiResponse {
  readonly studyGroupList: StudyGroup[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class StudyGroupService {
  constructor(private readonly http: HttpClient) {}

  loadStudyGroupList(
    filters: Filters,
    sortParams: SortParams,
    pagination?: Pagination
  ): Observable<StudyGroupListApiResponse> {
    console.log(`study-group.service [load]`);
    return timer(1000).pipe(switchMap(() => of(studyGroupListMock)));
  }

  updateStudyGroup(studyGroup: StudyGroup): Observable<StudyGroup> {
    console.log(`study-group.service [update]`);
    return timer(1000).pipe(
      switchMap(() => of(studyGroupListMock.studyGroupList[0]))
    );
  }
}
