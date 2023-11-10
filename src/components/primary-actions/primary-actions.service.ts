import { Injectable } from '@angular/core';
import { Semester, StudyGroup } from '../../domain/study-group';
import { DateUtils } from '../../utils/date-utils';

@Injectable()
export class PrimaryActionsService {
  createEmptyStudyGroup(): StudyGroup {
    return {
      averageMark: 0,
      coordinates: {
        x: 0,
        y: 0,
      },
      creationDate: DateUtils.nowISOString(),
      groupAdmin: {
        name: '',
        birthday: DateUtils.nowISOString(),
        height: 0,
        weight: 0,
        passportID: '',
      },
      id: 0,
      name: '',
      semesterEnum: Semester.SECOND,
      studentsCount: 0,
      transferredStudents: 0,
    };
  }
}
