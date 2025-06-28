import {TextStyle, ViewStyle} from 'react-native';
import {colors} from '../../theme';
import {fonts} from '../../theme/typography';

export const $dateNameStyle: TextStyle = {
  color: colors.darkLabel,
  fontFamily: fonts.workSans.regular,
  fontSize: 13,
};
export const $dateNumberStyle: TextStyle = {
  color: colors.primary,
  fontFamily: fonts.workSans.medium,
  fontSize: 14,
};

export const $calendarStrip: ViewStyle = {
  height: 71,
  marginBottom: 15,
  marginTop: 25,
};
