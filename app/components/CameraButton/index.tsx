import React from 'react';
import {Pressable} from 'react-native';
import {Box} from '../Box';
import {$container, $innerButton} from './styles';

type ICameraButton = {
  onPress: () => void;
};
export const CameraButton = ({onPress}: ICameraButton) => {
  return (
    <Box
      height={80}
      width={80}
      backgroundColor="white"
      borderRadius={100}
      style={$container}>
      <Pressable onPress={onPress}>
        <Box
          height={70}
          width={70}
          style={$innerButton}
          backgroundColor="primary"
          borderRadius={100}
        />
      </Pressable>
    </Box>
  );
};
