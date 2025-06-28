import React from 'react';
import {colors} from '../../../theme';
import {horizontalScale, isAndroid, IScroll} from '../../../utils';
import {Box} from '../../Box';
import {ProgressBar} from '../../ProgressBar';

type IOnboardingProgress = {
  progress: IScroll;
};
export const OnboardingProgress = ({progress}: IOnboardingProgress) => {
  const {
    secondary1,
    secondary1Dark,
    secondary2,
    secondary2Dark,
    secondary3,
    secondary3Dark,
  } = colors;

  const PROGRESS_COLORS = [
    {
      light: secondary1,
      dark: secondary1Dark,
    },
    {
      light: secondary2,
      dark: secondary2Dark,
    },
    {
      light: secondary3,
      dark: secondary3Dark,
    },
  ];

  return (
    <Box
      alignItems="center"
      mt={isAndroid ? 'o' : 'n'}
      style={{marginHorizontal: horizontalScale(30)}}>
      <ProgressBar
        containerHeight={7}
        containerBackgroundColor={PROGRESS_COLORS[progress.index].light}
        progressBackgroundColor={PROGRESS_COLORS[progress.index].dark}
        widthSize={progress.value}
      />
    </Box>
  );
};
