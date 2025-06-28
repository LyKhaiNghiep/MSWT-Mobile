/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {FormInfo} from '.';
import {CancelWhite, Dropdown, EndTime, StartTime} from '../../assets/svgs';
import {localStore} from '../../data';
import {formatAMPM, isDateValid} from '../../utils';
import {Box} from '../Box';
import {$textInput} from '../Form/Input/styles';
import {Text} from '../Text';
type SelectionType = 'Start' | 'End';

export type CurrentSelection = {
  index: number;
  type: SelectionType;
};
type WorkingHoursFormProps = {
  form?: FormInfo[];
  removeItem: (index: number) => void;
  updateItem: (index: CurrentSelection, value: Date) => void;
};

export const WorkingHoursForm = ({
  form,
  removeItem,
  updateItem,
}: WorkingHoursFormProps) => {
  const {addWorkingHours, workingHours} = localStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [title, setTile] = useState('');
  const [currentIndex, setCurrentIndex] = useState<
    CurrentSelection | undefined
  >();

  const openTimer = (index: number, type: SelectionType) => {
    setOpen(true);
    setCurrentIndex({index, type});
    setTile(type === 'Start' ? 'Start time' : 'End Time');
  };
  useEffect(() => {
    if (!open && currentIndex && isDateValid(time)) {
      const position = workingHours.findIndex(
        item => item.index === currentIndex.index,
      );
      if (currentIndex.type === 'Start') {
        workingHours[position].startTime = time;
      } else if (currentIndex.type === 'End') {
        workingHours[position].endTime = time;
      }
      addWorkingHours(workingHours);
      setCurrentIndex(undefined);
    }
  }, [currentIndex, time, updateItem, open, workingHours, addWorkingHours]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef!}
      onContentSizeChange={() =>
        scrollViewRef?.current?.scrollToEnd({animated: true})
      }>
      {form?.map(({endTime, index, startTime}) => (
        <Box key={index}>
          <Box gap="l" flexDirection="row">
            <Box flexGrow={1}>
              <Box gap="s" flexDirection="row" alignItems="center">
                <Text color="primary">Start time</Text>
                <StartTime />
              </Box>
              <Pressable onPress={() => openTimer(index, 'Start')}>
                <Box
                  justifyContent="space-between"
                  flexDirection="row"
                  alignItems="center"
                  style={$textInput}>
                  <Text color="primary" variant="medium">
                    {formatAMPM(startTime)}
                  </Text>
                  <Dropdown />
                </Box>
              </Pressable>
            </Box>

            <Box flexGrow={1}>
              <Box gap="s" flexDirection="row" alignItems="center">
                <Text color="primary">End time</Text>
                <EndTime />
              </Box>
              <Box
                gap="n"
                pt="n"
                flex={1}
                flexDirection="row"
                alignItems="center">
                <Pressable
                  style={{flexGrow: 1}}
                  onPress={() => openTimer(index, 'End')}>
                  <Box
                    style={[$textInput, {marginTop: 0}]}
                    justifyContent="space-between"
                    flexDirection="row"
                    alignItems="center">
                    <Text color="primary" variant="medium">
                      {formatAMPM(endTime)}
                    </Text>
                    <Dropdown />
                  </Box>
                </Pressable>

                <Pressable onPress={() => removeItem(index)}>
                  <Box
                    borderRadius={10}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="palePinkDark"
                    height={38}
                    width={35}>
                    <CancelWhite />
                  </Box>
                </Pressable>
              </Box>
            </Box>
          </Box>
          {/* LINE */}
          <Box marginVertical="l" height={2} backgroundColor="secondary2" />
        </Box>
      ))}

      <DatePicker
        modal
        mode="time"
        open={open}
        date={time}
        title={title}
        onConfirm={timeSelected => {
          setOpen(false);
          setTime(timeSelected);
        }}
        onCancel={() => {
          setOpen(false);
          setCurrentIndex(undefined);
        }}
      />
    </ScrollView>
  );
};
