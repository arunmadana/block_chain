import Moment from 'moment';
import MomentTimezone from 'moment-timezone';
import { DateFilterEnum } from '../Enums/DateFilterEnum';

/**
 * Timezone
 * 0 = 'PST - Pacific Standard Time UTC -7:00'
 */

/**
 * PST/PDT - America/Los_Angeles
 */

// Don't change timezone number, without cross checking with backend team
// frontend and backend has same timezone number for each timezone

export default function userDateTime(
  dateTimeInUTC,
  withToday = true,
  format = 'MM/DD/YYYY - HH:mm:ss'
) {
  const currentMomentDate = Moment.utc();
  const momentDate = Moment.utc(dateTimeInUTC);

  // when "Today" is not needed in the date
  if (!withToday) {
    return MomentTimezone.tz(momentDate, getUserTimeZone()).format(format);
  }

  const isToday =
    MomentTimezone.tz(currentMomentDate, getUserTimeZone()).format('D') ===
    MomentTimezone.tz(momentDate, getUserTimeZone()).format('D');

  return isToday
    ? 'Today ' +
        MomentTimezone.tz(momentDate, getUserTimeZone())
          .format(format)
          .slice(11, 21)
    : MomentTimezone.tz(momentDate, getUserTimeZone()).format(format);
}

export const getUserTimeZone = () => {
  return 'America/Los_Angeles'; // default PST
};

// Below method is going to be removed soon
// Since it is getting called from multiple places a default PDT offset is being returned.
// use the userDateTime method instead
export const getUserTimeZoneOffset = () => {
  return -8;
};

/**
 * @param {DateFilterEnum} dateFilterType
 * @param {Number} timeZone
 * @param {[Date, Date]} customRange
 * @returns {fromDate, toDate}
 */
export const getFilterDatesInUTC = (dateFilterType, customRange) => {
  const currentMomentDate = Moment.utc();
  const format = 'YYYY-MM-DD HH:mm:ss.ss';

  let fromDate;
  let toDate;

  switch (dateFilterType) {
    case DateFilterEnum.Today:
      fromDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .startOf('day')
        .utc()
        .format(format);
      toDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .utc()
        .format(format);
      return { fromDate, toDate };

    case DateFilterEnum.Yesterday:
      fromDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .subtract(1, 'day')
        .startOf('day')
        .utc()
        .format(format);
      toDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .subtract(1, 'day')
        .endOf('day')
        .utc()
        .format(format);
      return { fromDate, toDate };

    case DateFilterEnum.Last7Days:
      fromDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .subtract(6, 'days')
        .startOf('day')
        .utc()
        .format(format);
      toDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .utc()
        .format(format);
      return { fromDate, toDate };

    case DateFilterEnum.MonthToDate:
      fromDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .startOf('month')
        .utc()
        .format(format);
      toDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .utc()
        .format(format);
      return { fromDate, toDate };

    case DateFilterEnum.LastMonth:
      fromDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .subtract(1, 'month')
        .startOf('month')
        .utc()
        .format(format);
      toDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
        .subtract(1, 'month')
        .endOf('month')
        .utc()
        .format(format);
      return { fromDate, toDate };

    case DateFilterEnum.CustomDateRange:
      const fromLocal = Moment(customRange[0]).format(format);
      const toLocal = Moment(customRange[1]).endOf('day').format(format);

      fromDate = MomentTimezone.tz(fromLocal, getUserTimeZone())
        .utc()
        .format(format);
      toDate = MomentTimezone.tz(toLocal, getUserTimeZone())
        .utc()
        .format(format);
      return { fromDate, toDate };

    default:
      console.error('Invalid date filter type');
      return null;
  }
};

const currentPacificOffset = () => {
  const currentUTC = Moment.utc();
  const currentPacificTime = MomentTimezone.tz(
    currentUTC,
    getUserTimeZone()
  ).format();

  return `${currentPacificTime}`.slice(-5);
};

const formatDateWithYear = (date) => Moment(date).format('YYYY-MM-DD');

//convert to UTC start of day
export const convertToUTC = (dateInUTC, withOffSet = false, format = '') => {
  const requiredFormat = Moment(
    `${formatDateWithYear(dateInUTC)}T00:00:00-${currentPacificOffset()}`
  )
    .utc()
    .format(format);

  const offsetFormat = Moment(
    `${formatDateWithYear(dateInUTC)}T00:00:00-${currentPacificOffset()}`
  )
    .utc()
    .toISOString();

  return withOffSet ? offsetFormat : requiredFormat;
};

//convert to UTC start of day for agreements
export const agreementDateToUTC = (dateInUTC) => {
  var date = new Date(dateInUTC);
  date.setDate(date.getDate() + 1);
  const currentMomentDate = Moment.utc(date).format('YYYY-MM-DD');

  // const format = 'YYYY-MM-DD HH:mm:ss.ss';

  const utcDate = MomentTimezone.tz(currentMomentDate, getUserTimeZone())
    .startOf('day')
    .utc();

  return utcDate;
};
// Convert date to start of day with utc format

export const startDayUTC = (date, format = 'YYYY-MM-DD HH:mm:ss.ss') => {
  const requiredFormat = Moment(
    `${formatDateWithYear(date)}T00:00:00-${currentPacificOffset()}`
  )
    .utc()
    .format(format);

  return requiredFormat;
};

// Convert date to end of day with utc format

export const endDayUTC = (date, format = 'YYYY-MM-DD HH:mm:ss.ss') => {
  const requiredFormat = Moment(
    `${formatDateWithYear(date)}T00:00:00-${currentPacificOffset()}`
  )
    .add(1, 'day')
    .subtract(1, 'seconds')
    .utc()
    .format(format);

  return requiredFormat;
};

export const batchOutTime = (dateInUTC) => {
  const date = Moment(dateInUTC).subtract(1, 'second');
  return MomentTimezone.tz(date, getUserTimeZone())
    .endOf('day')
    .format('MM/DD/YYYY @ HH:mm:ss');
};
