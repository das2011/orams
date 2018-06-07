import format from 'date-fns/format'
import parse from 'date-fns/parse'

/* eslint-disable import/prefer-default-export */
export const formatDate = (date, dateFormat) => {
  if (date) {
    const parsed = parse(date)
    return format(parsed, dateFormat)
  }

  return ''
}
