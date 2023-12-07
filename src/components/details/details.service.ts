import { Injectable } from '@angular/core';
import { StudyGroup } from '../../domain/study-group';

import { DateUtils } from '../../utils/date-utils';
import { StudyGroupDetailsForm } from './details.component';

@Injectable()
export class DetailsService {
  mapFormToModel(form: StudyGroupDetailsForm): StudyGroup {
    const general = form.general.getRawValue();
    const groupAdmin = form.groupAdmin.getRawValue();

    return {
      id: general.id,
      name: general.groupName,
      coordinates: {
        x: general.coordinateX,
        y: general.coordinateY,
      },
      averageMark: general.averageMark,
      semesterEnum: general.semester,
      creationDate: DateUtils.tuiDayToISOString(general.creationDate),
      studentsCount: general.studentsCount,
      transferredStudents: general.transferredStudents,
      groupAdmin: {
        name: groupAdmin.adminName,
        height: groupAdmin.height,
        weight: groupAdmin.weight,
        passportID: groupAdmin.passportID,
        birthday: DateUtils.tuiDayToISOString(groupAdmin.birthday),
      },
    };
  }
}
