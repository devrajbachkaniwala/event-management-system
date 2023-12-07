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
  static getDateString(
    date: Date,
    format: 'dd-MM-yyyy' | 'yyyy-MM-dd' = 'dd-MM-yyyy'
  ) {
    const d = `${date.getDate() <= 9 ? 0 : ''}${date.getDate()}`;
    const m = `${date.getMonth() + 1 <= 9 ? 0 : ''}${date.getMonth() + 1}`;

    if (format === 'yyyy-MM-dd') {
      return `${date.getFullYear()}-${m}-${d}`;
    }

    return `${d}-${m}-${date.getFullYear()}`;
  }

  static getMonthString(date: Date) {
    return MONTH[date.getMonth() + 1];
  }
}
