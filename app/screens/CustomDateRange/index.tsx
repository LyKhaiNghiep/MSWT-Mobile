import {
  Calendar,
  toDateId,
  useDateRange,
} from '@marceloterreiro/flash-calendar';
import React, {useEffect} from 'react';
import {Dismiss, Screen} from '../../components';
import {localStore} from '../../data';

export const CustomDateRange = () => {
  const today = toDateId(new Date());
  const year = new Date().getFullYear();
  const endOfTheYear = `${year}-12-31`;

  const {
    calendarActiveDateRanges,
    onCalendarDayPress,

    // Also available for your convenience:
    dateRange, // { startId?: string, endId?: string }
    // isDateRangeValid, // boolean
    // onClearDateRange, // () => void
  } = useDateRange();
  const {startId, endId} = dateRange;
  const {addCustomRange, addDateRange} = localStore();
  useEffect(() => {
    if (dateRange.endId) {
      addDateRange(startId + '/' + endId);
      addCustomRange(true);
    }
  }, [addCustomRange, addDateRange, dateRange, endId, startId]);

  return (
    <Screen useAlignment>
      <Dismiss isModal={true} />
      <Calendar.List
        calendarColorScheme="light"
        calendarActiveDateRanges={calendarActiveDateRanges}
        calendarInitialMonthId={today}
        calendarMinDateId={today}
        calendarMaxDateId={endOfTheYear}
        onCalendarDayPress={onCalendarDayPress}
      />
    </Screen>
  );
};
