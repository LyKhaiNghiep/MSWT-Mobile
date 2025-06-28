import {TextStyle, ViewStyle} from 'react-native';
import {colors} from '../../../theme';
import {horizontalScale, moderateScale} from '../../../utils';

export const $item: ViewStyle = {
  marginHorizontal: horizontalScale(50),
};
export const $container: ViewStyle = {
  marginTop: 50,
};
export const $labelContainer: ViewStyle = {
  marginTop: 23,
  paddingHorizontal: 30,
};
export const $labelHeading: TextStyle = {
  color: colors.secondary4Dark,
  fontSize: moderateScale(39),
};
