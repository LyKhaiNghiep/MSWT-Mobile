import {ViewStyle} from 'react-native';
import {colors} from '../../../theme';
import {verticalScale} from '../../../utils';

export const $skottie: ViewStyle = {
  height: 80,
  width: 80,
};
export const $button: ViewStyle = {
  height: verticalScale(55),
  backgroundColor: colors.socialButton,
  justifyContent: 'center',
  alignItems: 'center',
};
