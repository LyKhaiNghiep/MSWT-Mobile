import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {useMemo, useRef, useState} from 'react';
import {localStore} from '../../data';
import {StackNavigation} from '../../navigators';
import {TimelineItem} from './item';

type AppointmentTimeline = {
  appointments: any[];
};
export const AppointmentTimeline = ({appointments}: AppointmentTimeline) => {
  const snapPoints = useMemo(() => ['1', '100%'], []);
  const navigation = useNavigation<StackNavigation>();
  const [patient, setPatient] = useState<any>();
  const {fullName} = localStore();

  const bottomSheetModalRef = useRef(null);

  const onPress = async () => {};
  const NOW = new Date().toString();
  //I observe some issue with moment()
  const Today = moment(NOW);
  const {specialty} = localStore();
  const closeModal = () => {};
  const timelineItemPress = (
    selfie: string,
    patientID: string,
    patientName: string,
    appointmentTime: string,
    appointmentDate: string,
  ) => {
    const fn = patientName.split(' ')[0];

    setPatient({
      selfie,
      patientID,
      patientName,
      fn,
      appointmentDate,
      appointmentTime,
    });
  };

  return (
    <>
      <FlashList
        data={appointments}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <TimelineItem item={item} onPress={timelineItemPress} />
        )}
        estimatedItemSize={200}
      />
    </>
  );
};
