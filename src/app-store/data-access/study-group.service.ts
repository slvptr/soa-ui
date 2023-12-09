import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, timer } from 'rxjs';
import { Coordinates, Person, StudyGroup } from '../../domain/study-group';
import {
  Filters,
  Pagination,
  SortOrder,
  SortParams,
} from '../../domain/controls';

export interface StudyGroupListApiResponse {
  readonly studyGroups: StudyGroup[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly totalCount: number;
}

export interface StudyGroupView {
  readonly name: string;
  readonly coordinates: Coordinates;
  readonly studentsCount: number;
  readonly transferredStudents: number;
  readonly averageMark: number;
  readonly semester: string;
  readonly groupAdmin: Person;
}

const getGroupViewParams = ({
  name,
  coordinates,
  studentsCount,
  transferredStudents,
  averageMark,
  semesterEnum,
  groupAdmin,
}: StudyGroup): StudyGroupView => ({
  name,
  coordinates,
  studentsCount,
  transferredStudents,
  averageMark,
  semester: semesterEnum.toString(),
  groupAdmin,
});

const API_BASE_URL = 'https://localhost:8762/defiant-server/api/v1/groups';

@Injectable({ providedIn: 'root' })
export class StudyGroupService {
  constructor(private readonly http: HttpClient) {}

  loadStudyGroupList(
    filters: Filters,
    sortParams: SortParams,
    pagination?: Pagination
  ): Observable<StudyGroupListApiResponse> {
    const sortParameters =
      sortParams.order !== SortOrder.Default
        ? {
            sortBy: sortParams.criteria,
            sortDir: sortParams.order,
          }
        : {};

    const params = {
      page: pagination?.index ?? 0,
      ...sortParameters,
    } as any;

    return this.http.post<StudyGroupListApiResponse>(
      `${API_BASE_URL}/filtered`,
      filters,
      {
        params,
      }
    );
  }

  updateStudyGroup(studyGroup: StudyGroup): Observable<StudyGroup> {
    return this.http.put<StudyGroup>(
      `${API_BASE_URL}/${studyGroup.id}`,
      getGroupViewParams(studyGroup)
    );
  }

  deleteStudyGroup(id: number): Observable<StudyGroup> {
    return this.http.delete<StudyGroup>(`${API_BASE_URL}/${id}`);
  }

  addStudyGroup(studyGroup: StudyGroup): Observable<StudyGroup> {
    return this.http.post<StudyGroup>(
      `${API_BASE_URL}`,
      getGroupViewParams(studyGroup)
    );
  }

  deleteAllByAverageMark(averageMark: number): Observable<number> {
    return this.http.post<number>(
      `${API_BASE_URL}/delete-all-by-average-mark/${averageMark}`,
      {}
    );
  }

  getGroupsWithTransferredStudentsLessThan(
    transferredStudents: number
  ): Observable<StudyGroup[]> {
    return this.http.post<StudyGroup[]>(
      `${API_BASE_URL}/transferred-students-less-than/${transferredStudents}`,
      {}
    );
  }

  getGroupWithSmallestCoordinate(): Observable<StudyGroup> {
    return this.http.post<StudyGroup>(
      `${API_BASE_URL}/smallest-coordinates`,
      {}
    );
  }
}
