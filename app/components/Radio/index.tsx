import React, {useEffect, useState} from 'react';
import {Pressable} from 'react-native';
import {Radio, RadioActive} from '../../assets/svgs';
import {localStore} from '../../data';
import {Box} from '../Box';
import {Text} from '../Text';

type RadioButtonsProps = {
  title: string[];
  onCustomPress: () => void;
};
export const RadioButtons = ({title, onCustomPress}: RadioButtonsProps) => {
  const {addDateRange, addCustomRange, dateRange} = localStore();

  const isCustomDate = dateRange.includes('/');
  const [active, setActive] = useState<string>();
  const onPress = (radioTitle: string) => {
    if (radioTitle.includes('Custom')) {
      onCustomPress();
    } else {
      addDateRange(radioTitle);
      addCustomRange(false);
      setActive(radioTitle);
    }
  };
  useEffect(() => {
    if (dateRange) {
      setActive(isCustomDate ? 'Custom Range' : dateRange);
    }
  }, [dateRange, isCustomDate]);
  return (
    <Box mt="l" gap="l">
      {title.map((label, index) => (
        <Pressable key={index} onPress={() => onPress(label)}>
          <Box flexDirection="row" gap="n" alignItems="center">
            {label.includes('Custom') && isCustomDate && active === label ? (
              <RadioActive />
            ) : !label.includes('Custom') &&
              !isCustomDate &&
              active === label ? (
              <RadioActive />
            ) : (
              <Radio />
            )}
            <Text color="primary">{label}</Text>
          </Box>
        </Pressable>
      ))}
    </Box>
  );
};
