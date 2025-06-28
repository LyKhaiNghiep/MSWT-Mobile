import React, {ReactNode} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {$container} from './styles';

type IGradient = {
  colors: string[];
  children: ReactNode;
};
export const Gradient = ({colors, children}: IGradient) => {
  return (
    <LinearGradient colors={colors} style={$container}>
      {children}
    </LinearGradient>
  );
};
