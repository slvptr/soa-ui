import { Injectable } from '@angular/core';
import { Semester, StudyGroup } from '../../domain/study-group';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { DateUtils } from '../../utils/date-utils';

export type StudyGroupDetailsForm = {
  general: FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    coordinateX: FormControl<number>;
    coordinateY: FormControl<number>;
    studentsCount: FormControl<number>;
    transferredStudents: FormControl<number>;
    averageMark: FormControl<number>;
    semester: FormControl<Semester>;
    creationDate: FormControl<TuiDay>;
  }>;
  groupAdmin: FormGroup<{
    name: FormControl<string>;
    height: FormControl<number>;
    weight: FormControl<number>;
    passportID: FormControl<string>;
    birthday: FormControl<TuiDay>;
  }>;
};

@Injectable()
export class StudyGroupDetailsService {
  mapFormToModel(form: StudyGroupDetailsForm): StudyGroup {
    const general = form.general.getRawValue();
    const groupAdmin = form.groupAdmin.getRawValue();

    return {
      id: general.id,
      name: general.name,
      coordinates: {
        x: general.coordinateX,
        y: general.coordinateY,
      },
      averageMark: general.averageMark,
      semesterEnum: general.semester,
      creationDate: DateUtils.tuiDayToISO(general.creationDate),
      studentsCount: general.studentsCount,
      transferredStudents: general.transferredStudents,
      groupAdmin: {
        name: groupAdmin.name,
        height: groupAdmin.height,
        weight: groupAdmin.weight,
        passportID: groupAdmin.passportID,
        birthday: DateUtils.tuiDayToISO(groupAdmin.birthday),
      },
    };
  }
}
