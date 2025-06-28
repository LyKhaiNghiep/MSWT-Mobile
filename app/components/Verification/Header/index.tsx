import React from 'react';
import {moderateScale} from '../../../utils';
import {Box} from '../../Box';
import {Text} from '../../Text';

type IHeader = {
  title: string;
  summary?: string;
  addDefault?: boolean;
};
export const Header = ({summary, title, addDefault = true}: IHeader) => {
  return (
    <Box marginHorizontal={addDefault ? 'l' : 'o'} pt={addDefault ? 'xl' : 'o'}>
      <Text color="primary" variant="mSemiBold" fontSize={moderateScale(30)}>
        {title}
      </Text>
      <Text variant={addDefault ? 'regular' : 'medium'} pt="xs">
        {summary
          ? summary
          : 'Your information will be shared with our Medical Expert team for identity verification.'}
      </Text>
    </Box>
  );
};
