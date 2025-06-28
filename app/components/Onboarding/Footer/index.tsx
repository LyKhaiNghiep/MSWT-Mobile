import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StackNavigation} from '../../../navigators';
import {Box} from '../../Box';
import {Button} from '../../Button';
import {$container} from './styles';

export const OnboardingFooter = () => {
  const navigation = useNavigation<StackNavigation>();

  return (
    <Box style={$container}>
      <Box flexGrow={1} justifyContent="flex-end">
        <Button
          label="Get started"
          onPress={() => navigation.navigate('Verification')}
        />
      </Box>
    </Box>
  );
};
