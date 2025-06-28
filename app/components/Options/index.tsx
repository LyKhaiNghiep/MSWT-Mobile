import React from 'react';
import {Box, Text} from '..';
import {MarkCheck} from '../../assets/svgs';
import {moderateScale} from '../../utils';

type MarkCheck = {
  isActive: boolean;
  label: string;
};
export const Option = ({isActive, label}: MarkCheck) => {
  return (
    <Box
      px="m"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center">
      <Text
        color="primary"
        paddingVertical="m"
        variant={isActive ? 'semiBold' : 'regular'}
        fontSize={moderateScale(15)}>
        {label}
      </Text>
      {isActive && <MarkCheck />}
    </Box>
  );
};
