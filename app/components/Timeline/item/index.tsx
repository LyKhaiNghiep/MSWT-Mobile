import React from 'react';
import {Pressable} from 'react-native';
import {spacing} from '../../../theme/spacing';
import {moderateScale, startEndTime} from '../../../utils';
import {Avatar} from '../../Avatar';
import {Box} from '../../Box';
import {Text} from '../../Text';
import {$item} from '../styles';

type TimelineItemProps = {
  onPress: (
    selfie: string,
    patientID: string,
    patientName: string,
    appointmentTime: string,
    appointmentDate: string,
  ) => void;
  item: any;
};

export const TimelineItem = ({onPress, item}: TimelineItemProps) => {
  return (
    <Box flexDirection="row" alignItems="flex-start" mt="s">
      <Text>{item?.time}</Text>
      {item?.data?.map(
        ({
          appointmentTime,
          patientName,
          selfie,
          patientID,
          appointmentDate,
        }) => (
          <Pressable
            key={item}
            style={$item}
            onPress={() =>
              onPress(
                selfie,
                patientID,
                patientName,
                appointmentTime,
                appointmentDate,
              )
            }>
            <Box>
              <Box height={1} backgroundColor="inputStroke" />
              <Box
                paddingHorizontal="n"
                paddingVertical="m"
                mt="n"
                gap="n"
                flexDirection="row"
                backgroundColor="secondary2"
                borderRadius={spacing.borderRadius}>
                <Avatar wnh={40} uri={selfie} />

                <Box flexDirection="row">
                  <Box gap="n">
                    <Text
                      color="primary"
                      variant="medium"
                      fontSize={moderateScale(14)}>
                      {patientName}
                    </Text>
                    <Text color="darkLabel">Patient</Text>

                    <Text fontSize={moderateScale(14)} color="primary">
                      {startEndTime(
                        appointmentTime[0].startTime,
                        appointmentTime[0].endTime,
                      )}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Pressable>
        ),
      )}
    </Box>
  );
};
