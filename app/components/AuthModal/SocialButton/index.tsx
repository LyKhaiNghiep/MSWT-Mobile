import React from 'react';
import {Box} from '../../Box';
import {$buttonContainer} from '../../Button/styles';
import {$border} from '../style';

type SocialButton = {
  type: 'google' | 'apple';
  onPress?: () => void;
  isLoading?: boolean;
};
export const SocialButton = ({type, onPress, isLoading}: SocialButton) => {
  const title =
    type === 'google' ? 'Continue with Google' : 'Continue with Apple';
  return (
    <Box mb="xs" style={[$buttonContainer, $border]} overflow="hidden"></Box>
  );
};
