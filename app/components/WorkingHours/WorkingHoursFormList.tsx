import React, {useEffect} from 'react';
import {localStore} from '../../data';
import {moderateScale} from '../../utils';
import {Box} from '../Box';
import {Text} from '../Text';
import {CurrentSelection, WorkingHoursForm} from './WorkingHoursForm';

export type FormInfo = {
  index: number;
  startTime: Date;
  endTime: Date;
};

type WorkingHoursFormListProps = {
  addMore: boolean;
};
export const WorkingHoursFormList = ({addMore}: WorkingHoursFormListProps) => {
  const {workingHours, addWorkingHours} = localStore();
  const emptyTime = new Date('');

  const NEW_FORM: FormInfo = {
    endTime: emptyTime,
    startTime: emptyTime,
    index: workingHours?.length,
  };

  useEffect(() => {
    if (addMore) {
      addWorkingHours([...workingHours, NEW_FORM]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMore]);

  const removeItem = (index: number) => {
    addWorkingHours(workingHours.filter(item => item.index !== index));
  };

  const updateItem = (selection: CurrentSelection, value: Date) => {
    const position = workingHours.findIndex(
      item => item.index === selection.index,
    );
    if (selection.type === 'Start') {
      workingHours[position].startTime = value;
    } else if (selection.type === 'End') {
      workingHours[position].endTime = value;
    }
    addWorkingHours(workingHours);
  };
  return (
    <>
      {workingHours.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text
            fontSize={moderateScale(15)}
            textAlign="center"
            lineHeight={22}
            variant="regular"
            color="primary">
            Please add your working hours to help patients book appointments.
          </Text>
        </Box>
      ) : (
        <WorkingHoursForm
          form={workingHours}
          removeItem={removeItem}
          updateItem={updateItem}
        />
      )}
    </>
  );
};
