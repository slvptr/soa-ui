export interface Coordinates {
  readonly x: number;
  readonly y: number;
}

export interface Person {
  readonly name: string;
  readonly birthday: string;
  readonly height: number;
  readonly weight: number;
  readonly passportID: string;
}

export enum Semester {
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  SIXTH = 6,
  SEVENTH = 7,
}

export interface StudyGroup {
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
