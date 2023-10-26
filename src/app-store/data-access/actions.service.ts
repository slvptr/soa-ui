import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { Coordinates, Person, Semester } from '../../domain/study-group';
import {
  countExpelledResponseMock,
  moveStudentsResponseMock,
} from './actions.mock';

export interface MoveStudentsApiResponse {
  readonly id: number;
  readonly name: string;
  readonly coordinates: Coordinates;
  readonly creationDate: string;
  readonly studentsCount: number;
  readonly transferredStudents: number;
  readonly averageMark: number;
  readonly semesterEnum: Semester;
  readonly groupAdmin: Person;
}

export interface CountExpelledApiResponse {
  readonly numberOfExpelledStudents: number;
}

@Injectable({ providedIn: 'root' })
export class ActionsService {
  moveStudents(
    fromGroup: string,
    toGroup: string
  ): Observable<MoveStudentsApiResponse> {
    console.log(`actions.service [move]: ${fromGroup} ${toGroup}`);
    return timer(3000).pipe(switchMap(() => of(moveStudentsResponseMock)));
  }

  countExpelled(): Observable<CountExpelledApiResponse> {
    console.log(`actions.service [count]`);
    return timer(1000).pipe(switchMap(() => of(countExpelledResponseMock)));
  }
}
