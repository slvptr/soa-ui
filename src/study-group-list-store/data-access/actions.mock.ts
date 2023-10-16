import {
  CountExpelledApiResponse,
  MoveStudentsApiResponse,
} from './actions.service';
import { Semester } from '../../domain/study-group';

export const countExpelledResponseMock: CountExpelledApiResponse = {
  numberOfExpelledStudents: 23,
};

export const moveStudentsResponseMock: MoveStudentsApiResponse = {
  averageMark: 4.2,
  coordinates: {
    x: 1,
    y: 2,
  },
  creationDate: '2023-10-13T00:00:09Z',
  groupAdmin: {
    name: 'Kostya Gay',
    birthday: '2023-09-13T00:00:09Z',
    height: 8,
    weight: 8,
    passportID: '8888',
  },
  id: 0,
  name: 'P34121',
  semesterEnum: Semester.FOURTH,
  studentsCount: 0,
  transferredStudents: 0,
};
