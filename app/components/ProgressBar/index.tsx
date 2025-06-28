import React from 'react';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {AnimatedBox, Box} from '../Box';

type ProgressBarProps = {
  widthSize: number;
  containerHeight: number;
  containerBackgroundColor: string;
  progressBackgroundColor: string;
};

export const ProgressBar = ({
  widthSize,
  containerBackgroundColor,
  progressBackgroundColor,
  containerHeight,
}: ProgressBarProps) => {
  const widthStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${widthSize}%`),
    };
  });

  return (
    <Box
      style={{backgroundColor: containerBackgroundColor}}
      height={containerHeight}
      width={'40%'}
      borderRadius={100}>
      <AnimatedBox
        borderRadius={100}
        height={'100%'}
        style={[widthStyle, {backgroundColor: progressBackgroundColor}]}
      />
    </Box>
  );
};
