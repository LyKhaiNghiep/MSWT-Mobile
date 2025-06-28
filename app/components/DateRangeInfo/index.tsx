import React from 'react';
import {CalenderTab} from '../../assets/svgs';
import {localStore} from '../../data';
import {spacing} from '../../theme/spacing';
import {dateInfo, moderateScale} from '../../utils';
import {Box} from '../Box';
import {Text} from '../Text';

export const DateRangeInfo = () => {
  const {dateRange} = localStore();

  return (
    <Box
      flexDirection="row"
      mt="m"
      borderRadius={spacing.borderRadius}
      paddingHorizontal="m"
      paddingVertical="m"
      backgroundColor="greenLight">
      <CalenderTab />
      <Box paddingHorizontal="n">
        <Text variant="semiBold" color="primary">
          {dateRange.includes('/') ? 'Custom Date' : dateRange}
        </Text>
        <Text
          pt="s"
          textAlign="left"
          color="primary"
          variant="regular"
          fontSize={moderateScale(14)}>
          {dateInfo(dateRange)}
        </Text>
      </Box>
    </Box>
  );
};
