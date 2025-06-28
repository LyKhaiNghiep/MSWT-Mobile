import {ViewStyle} from 'react-native';
import {colors} from '../../theme';
import {spacing} from '../../theme/spacing';
import {horizontalScale} from '../../utils';

export const $container: ViewStyle = {
  paddingHorizontal: horizontalScale(20),
};
export const $default: ViewStyle = {
  backgroundColor: 'white',
};
export const $shadow: ViewStyle = {
  borderTopRightRadius: spacing.borderRadius,
  borderTopLeftRadius: spacing.borderRadius,
  shadowColor: colors.formLabel,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 10,
};
