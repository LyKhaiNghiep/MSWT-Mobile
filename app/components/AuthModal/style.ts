import {ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {horizontalScale} from '../../utils';

export const $container: ViewStyle = {
  borderRadius: spacing.borderRadius,
  backgroundColor: colors.white,
};

export const $indicator: ViewStyle = {
  backgroundColor: colors.secondary4,
};
export const $bottomSheetContainer: ViewStyle = {
  flex: 1,
  paddingTop: spacing.n,
};
export const $border: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.secondary4,
};
export const $buttonGroup: ViewStyle = {
  marginHorizontal: horizontalScale(25),
};
