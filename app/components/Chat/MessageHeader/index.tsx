import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Alert, Pressable} from 'react-native';
import {StackNavigation} from '../../../navigators';
import {StackTabNavigation} from '../../../navigators/TabParamList';
import {moderateScale} from '../../../utils';
import {Avatar} from '../../Avatar';
import {Box} from '../../Box';
import {Text} from '../../Text';

type MessageHeaderProps = {
  channelSelfie: string;
  channelName: string;
  patientID: string;
};
export const MessageHeader = memo(
  ({channelName, channelSelfie, patientID}: MessageHeaderProps) => {
    const {isConnected} = useNetInfo();

    const navigation = useNavigation<StackTabNavigation>();
    const mainNavigation = useNavigation<StackNavigation>();
    const onPress = () => {};
    const videoCallOnPress = () => {
      if (isConnected) {
      } else {
        Alert.alert(
          "We're unable to establish a connection. Please connect to the internet to proceed with the video call.",
        );
      }
    };

    return (
      <>
        <Box
          marginTop="s"
          flexDirection="row"
          pr="l"
          alignItems="center"
          justifyContent="space-between">
          <Box flex={1} flexDirection="row" alignItems="center">
            <Box></Box>
            <Box alignItems="center" flexDirection="row" gap="n">
              <Avatar uri={channelSelfie} patientID={patientID} />

              <Box gap="s">
                <Text
                  fontSize={moderateScale(14)}
                  numberOfLines={1}
                  variant="buttonLabel"
                  color="primary"
                  ellipsizeMode="tail">
                  {channelName}
                </Text>
                <Text
                  color="primary"
                  variant="regular"
                  fontSize={moderateScale(13)}>
                  Patient
                </Text>
              </Box>
            </Box>
          </Box>
          <Pressable hitSlop={70} onPress={videoCallOnPress}></Pressable>
        </Box>
        {/* LINE */}
        <Box marginVertical="n" height={0.7} backgroundColor="line" />
      </>
    );
  },
);
