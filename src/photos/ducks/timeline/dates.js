import {
  isThisYear,
  differenceInCalendarMonths,
  differenceInCalendarDays,
  differenceInHours,
  compareAsc,
  parseISO
} from 'date-fns'

/**
 * @param {function} f - date-fns format function
 * @param {string} date - date passed as string
 * @param {string} formatter - The wanted format. See https://date-fns.org/v2.0.0/docs/format
 * @returns {string} The formatted date
 */
const formatDate = (f, date, formatter) => {
  return f(parseISO(date), formatter)
}

export const formatH = (f, date) => {
  return formatDate(f, date, 'HH')
}

export const formatD = (f, date) => {
  return formatDate(f, date, 'dd')
}

export const formatDMY = (f, date) => {
  return formatDate(f, date, 'dd LLLL') + addYear(f, date)
}

export const formatYMD = (f, date) => {
  return formatDate(f, date, 'yyyy-LL-dd')
}

const addYear = (f, date) => {
  return isThisYear(date) ? '' : formatDate(f, date, ' yyyy')
}

export const isSameMonth = (f, newerDate, olderDate) => {
  return (
    differenceInCalendarMonths(parseISO(newerDate), parseISO(olderDate)) === 0
  )
}

export const isSameDay = (f, newerDate, olderDate) => {
  return (
    differenceInCalendarDays(parseISO(newerDate), parseISO(olderDate)) === 0
  )
}

export const isSameHour = (f, newerDate, olderDate) => {
  return differenceInHours(parseISO(newerDate), parseISO(olderDate)) === 0
}

export const isEqualOrNewer = (newerDate, olderDate) => {
  return compareAsc(parseISO(newerDate), parseISO(olderDate)) >= 0
}

export const isEqualOrOlder = (newerDate, olderDate) => {
  return compareAsc(parseISO(newerDate), parseISO(olderDate)) <= 0
}
