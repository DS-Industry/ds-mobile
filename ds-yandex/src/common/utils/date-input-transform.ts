import * as moment from 'moment';
export function dateInputTransform(date: string, format: string): Date {
  const momentDate: moment.Moment = moment(date, format);

  return momentDate.toDate();
}
