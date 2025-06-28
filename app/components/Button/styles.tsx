import {TextStyle, ViewStyle} from 'react-native';
import {colors} from '../../theme';
import {moderateScale} from '../../utils';

export const $buttonContainer: ViewStyle = {
  borderRadius: moderateScale(10),
};
export const $button: ViewStyle = {
  height: moderateScale(55),
  backgroundColor: colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
};
export const $label: TextStyle = {
  fontSize: moderateScale(17),
  letterSpacing: 1,
};
export const $skottie: TextStyle = {
  height: 60,
  width: 60,
};
