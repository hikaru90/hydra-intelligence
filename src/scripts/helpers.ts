import { timeFormatLocale } from "d3-time-format";

const de = timeFormatLocale({
  dateTime: "%A, der %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  shortMonths: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
});

export const formatGerman = de.format;
export const parseGerman = de.parse;

export const subtractTime = (time: Date, minutes: number) => {
  return new Date(time.getTime() - minutes * 60 * 1000);
};