import {ImageStyle} from 'react-native-fast-image';
import {moderateScale} from '../../utils';
import { spacing } from '../../theme/spacing';

export const $fastImage: ImageStyle = {
  borderRadius: spacing.borderRadius,
};
export const $widthHeightStyle = (wnh: number = 40) => ({
  width: moderateScale(wnh),
  height: moderateScale(wnh),
});
