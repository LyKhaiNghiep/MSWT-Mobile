import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Screen} from '../../components';
import {localStore} from '../../data';
import {useFirestore} from '../../hooks';
import {Basic, WorkingHours} from '../../layout';
import {StackNavigation} from '../../navigators';
import {isDateValid} from '../../utils';

export const ManageAppointment = () => {
  const {fee, dateRange, workingHours} = localStore();
  const {error, updateDoctorSchedule, hasReceived} = useFirestore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigation>();

  const basicAppointmentInformationIsValid = fee && dateRange ? true : false;
  const workingHoursIsValid =
    isDateValid(workingHours[0]?.endTime) &&
    isDateValid(workingHours[0]?.startTime);

  const INITIAL_LAYOUT = basicAppointmentInformationIsValid ? 2 : 1;

  const [layout, setLayout] = useState(INITIAL_LAYOUT);

  useEffect(() => {
    if (hasReceived) {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeTab'}],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasReceived]);
  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  const nextLayout = () => {
    if (layout === 2) {
      setLayout(3);
      setLoading(true);
      updateDoctorSchedule();
    } else {
      setLayout(layout + 1);
    }
  };

  const enableButton =
    layout === 1
      ? basicAppointmentInformationIsValid
      : layout === 2
      ? workingHoursIsValid
      : layout === 3
      ? !isLoading
      : false;
  return (
    <Screen
      isLoading={isLoading}
      useAlignment
      buttonLabel="Continue"
      buttonOnPress={nextLayout}
      enabled={enableButton}>
      {layout === 1 ? <Basic /> : <WorkingHours />}
    </Screen>
  );
};
