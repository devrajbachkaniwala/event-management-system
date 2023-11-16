enum MONTH {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export class DateService {
  static getDateString(date: Date) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  static getMonthString(date: Date) {
    return MONTH[date.getMonth() + 1];
  }
}
