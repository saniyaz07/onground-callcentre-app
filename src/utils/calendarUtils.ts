export interface CalendarCell {
  day: number;
  month: number; // 0-11
  year: number;
  isCurrentMonth: boolean;
  isLeading: boolean;
  isTrailing: boolean;
  dateKey: string; // YYYY-MM-DD
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const WEEKDAY_NAMES_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const;

export const WEEKDAY_NAMES_SHORT = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
] as const;

export const WEEKDAY_NAMES_MINI = [
  'S', 'M', 'T', 'W', 'T', 'F', 'S'
] as const;

/**
 * Returns whether a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns the exact number of days in a given year and month (0-indexed).
 * Correctly accounts for 28/29/30/31 day months.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Returns the 0-indexed day of the week (0 = Sunday ... 6 = Saturday) for the 1st of the month.
 */
export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Builds a complete seven-column calendar grid with leading days from previous month,
 * all days of the current month, and trailing days from next month to complete the grid.
 */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const startDayOfWeek = getFirstDayOfWeek(year, month); // 0 = Sun ... 6 = Sat
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);

  const cells: CalendarCell[] = [];

  // 1. Leading days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
    cells.push({
      day: prevDay,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isLeading: true,
      isTrailing: false,
      dateKey
    });
  }

  // 2. Days of current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      day: d,
      month,
      year,
      isCurrentMonth: true,
      isLeading: false,
      isTrailing: false,
      dateKey
    });
  }

  // 3. Trailing days from next month to complete the 7-column row
  const remainder = cells.length % 7;
  const trailingCount = remainder === 0 ? 0 : 7 - remainder;
  for (let d = 1; d <= trailingCount; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateKey = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      day: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isLeading: false,
      isTrailing: true,
      dateKey
    });
  }

  return cells;
}

/**
 * Navigates by delta months (-1 or +1), cleanly wrapping between December and January.
 */
export function navigateMonth(year: number, month: number, delta: number): { year: number; month: number } {
  let newMonth = month + delta;
  let newYear = year;
  while (newMonth > 11) {
    newMonth -= 12;
    newYear += 1;
  }
  while (newMonth < 0) {
    newMonth += 12;
    newYear -= 1;
  }
  return { year: newYear, month: newMonth };
}
