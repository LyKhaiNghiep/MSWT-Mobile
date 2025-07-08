import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import moment from 'moment';
import React, {useMemo, useRef, useState} from 'react';
import {
  CalenderActive,
  ChatFill,
  TimeFill,
  Users,
  VideoOn,
} from '../../assets/svgs';
import {localStore} from '../../data';
import {StackNavigation} from '../../navigators';
import {formatDate, moderateScale, startEndTime} from '../../utils';
import {$indicator} from '../AuthModal/style';
import {Avatar} from '../Avatar';
import {Box} from '../Box';
import {Button} from '../Button';
import {Dismiss} from '../Dismiss';
import {Text} from '../Text';
import {Header} from '../Verification';
import {TimelineItem} from './item';
import {$bottomView} from './styles';

type AppointmentTimeline = {
  appointments: any[];
};
export const AppointmentTimeline = ({appointments}: AppointmentTimeline) => {
  const snapPoints = useMemo(() => ['1', '100%'], []);
  const navigation = useNavigation<StackNavigation>();
  const [patient, setPatient] = useState<any>();
  const {fullName} = localStore();

  const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);

  const onPress = async () => {
    bottomSheetModalRef.current?.close();
  };
  const NOW = new Date().toString();
  //I observe some issue with moment()
  const Today = moment(NOW);
  const {specialty} = localStore();
  const closeModal = () => {
    bottomSheetModalRef.current?.close();
  };
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
    bottomSheetModalRef.current?.present();
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        // backgroundStyle={$container}
        handleIndicatorStyle={$indicator}
        backdropComponent={BottomSheetBackdrop}
        snapPoints={snapPoints}>
        <BottomSheetView style={$bottomView}>
          <Box flex={1}>
            <Box flex={1} paddingHorizontal="l">
              <Dismiss isModal={true} modalOnPress={closeModal} />
              <Box marginTop="ll">
                <Header
                  addDefault={false}
                  title={`Consultation with\n${patient?.fn}.`}
                  summary=" "
                />
              </Box>
              <Box mt="ll">
                <Box flexDirection="row" gap="n" alignItems="center">
                  <CalenderActive width={20} height={20} />
                  <Text
                    fontSize={moderateScale(13)}
                    variant="medium"
                    color="primary">
                    {formatDate(patient?.appointmentDate)}
                  </Text>
                </Box>
                <Box
                  marginVertical="s"
                  ml="xs"
                  height={40}
                  width={1}
                  backgroundColor="darkLabel"
                />
                <Box flexDirection="row" gap="n" alignItems="center">
                  <TimeFill />
                  <Text
                    fontSize={moderateScale(13)}
                    variant="medium"
                    color="primary">
                    {patient?.appointmentTime[0].startTime &&
                      startEndTime(
                        patient?.appointmentTime[0].startTime,
                        patient?.appointmentTime[0].endTime,
                      )}
                    {/* 9:30 AM - 10:30 AM */}
                  </Text>
                </Box>
                <Box
                  marginVertical="s"
                  ml="xs"
                  height={40}
                  width={1}
                  backgroundColor="darkLabel"
                />
                <Box flexDirection="row" gap="n" alignItems="center">
                  <Users />
                  <Text
                    fontSize={moderateScale(13)}
                    variant="medium"
                    color="primary">
                    Attendee
                  </Text>
                </Box>
                <Box mt="l" ml="ll" gap="lm">
                  <Box gap="n" alignItems="center" flexDirection="row">
                    {/* Patient selfie */}
                    <Avatar />
                    <Box gap="s">
                      <Text variant="medium" color="primary">
                        {patient?.patientName}
                      </Text>
                      <Text color="darkLabel">Patient</Text>
                    </Box>
                  </Box>

                  <Box gap="n" alignItems="center" flexDirection="row">
                    <Avatar uri={patient?.selfie} />
                    <Box gap="s">
                      <Text variant="medium" color="primary">
                        {fullName}
                      </Text>
                      <Text color="darkLabel">{specialty}</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            {Today.isSameOrAfter(patient?.appointmentTime[0].startTime) && (
              <Box alignItems="center" pb="ll" pt="l" paddingHorizontal="l">
                <Box gap="l" flexDirection="row">
                  <Button label="Chat" leftIcon={<ChatFill fill="#fff" />} />
                  <Button
                    onPress={onPress}
                    label="Video Call"
                    useSecondary={true}
                    leftIcon={<VideoOn fill="#fff" />}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
