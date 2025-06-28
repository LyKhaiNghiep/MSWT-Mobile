import React, {ReactNode} from 'react';
import {Pressable} from 'react-native';
import {Calender, Dropdown as DropDownIcon} from '../../../assets/svgs';
import {Box} from '../../Box';
import {Text} from '../../Text';
import {$dropDown, $pressable} from './styles';

type IDropdown = {
  label: string;
  onPress?: () => void;
  value?: string | undefined;
  children?: ReactNode;
};
export const Dropdown = ({label, onPress, value, children}: IDropdown) => {
  const PADDING_ZERO = -12;
  const isCountryLabel = label === 'Country';
  return (
    <Box flex={1}>
      <Text color="formLabel" variant="medium">
        {label}
      </Text>
      <Pressable style={$pressable} onPress={onPress}>
        <Box
          style={[$dropDown]}
          flexDirection="row"
          justifyContent="space-between">
          <Box flex={1} style={[isCountryLabel ? {margin: PADDING_ZERO} : {}]}>
            {isCountryLabel ? (
              <>{children}</>
            ) : (
              <Text color="primary">{value}</Text>
            )}
          </Box>

          {label === 'Date of Birth' ? <Calender /> : <DropDownIcon />}
        </Box>
      </Pressable>
    </Box>
  );
};
