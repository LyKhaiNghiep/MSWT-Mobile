import {I18nManager, Platform} from 'react-native';
import {FadeInDown} from 'react-native-reanimated';

export const isAndroid = Platform.OS === 'android' ? true : false;
export const isRTL = I18nManager.isRTL ? true : false;
export const UUID = () => {
  return Math.floor(Math.random() * Date.now());
};
export const FADE_IN = (value: number) =>
  FadeInDown.springify()
    .damping(30)
    .mass(5)
    .stiffness(10)
    .delay(value)
    .duration(3000);

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function dateInfo(type: string) {
  //DAYS ==> WEEKDAYS ONLY
  //ENDS ==> WEEKENDS ONLY
  //ENTIRE ==>ENTIRE WEEK
  const startDate = type.includes('/') && type.split('/')[0];
  const endDate = type.includes('/') && type.split('/')[1];

  if (type.includes('days')) {
    return `Selecting ${type} indicates your availability for patient appointments from Monday to Friday every week.`;
  } else if (type.includes('ends')) {
    return `Selecting ${type} indicates your availability for patient appointments on both Saturday and Sunday`;
  } else if (type.includes('Entire')) {
    return `Selecting ${type} indicates your availability for patient appointments every day, Monday through Sunday.`;
  } else if (type.includes('/')) {
    return `Selecting custom range indicates your availability for patient appointments between the selected dates, from ${startDate} to ${endDate}  `;
  }
}

export const formatDate = (dob: Date) => {
  if (!dob || (dob instanceof Date && isNaN(dob.getTime()))) {
    return ' ';
  }
  const dateObj = new Date(dob);

  return `${
    MONTH_NAMES[dateObj.getMonth()]
  } ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
};
export function delay(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration));
}
export const isDateValid = (dob: Date) => {
  const isValid = !dob || (dob instanceof Date && isNaN(dob.getTime()));

  return !isValid;
};
export const formatTiming = (start: any, end: any) => {
  const startTime = new Date(start);
  const endTime = new Date(end);

  return `${formatAMPM(startTime)} - ${formatAMPM(endTime)}`;
};
export const startEndTime = (start: any, end: any) => {
  const startTime = new Date(start.seconds * 1000);
  const endTime = new Date(end.seconds * 1000);

  return `${formatAMPM(startTime)} - ${formatAMPM(endTime)}`;
};
export const formatAMPM = (date: Date) => {
  //using date.getHours() directly invoke an error
  if (date !== undefined && isDateValid(date) && date !== null) {
    let hours = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours %= 12;
    hours = hours || 12;

    const strTime = `${hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    } ${ampm}`;
    return strTime;
  }
};

export function isEmpty(str: string) {
  return !str || str.length === 0;
}

export const today = () => {
  const date: Date = new Date();
  const month = date.getMonth();
  const day = date.getUTCDay();
  const year = date.getUTCFullYear();
  return {month, day, year};
};
export type IScroll = {
  index: number;
  value: number;
};
export const SCROLL_DEFAULT: IScroll = {index: 0, value: 33.3};
