import { TuiDay } from '@taiga-ui/cdk';

export namespace DateUtils {
  export const tuiDayToISOString = (tuiDay: TuiDay) =>
    new Date(tuiDay.toUtcNativeDate().getTime()).toISOString();

  export const nowISOString = () => new Date().toISOString();
}
