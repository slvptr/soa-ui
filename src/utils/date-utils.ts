import { TuiDay } from '@taiga-ui/cdk';

export namespace DateUtils {
  export const tuiDayToISO = (tuiDay: TuiDay) =>
    new Date(tuiDay.toUtcNativeDate().getTime()).toISOString();
}
