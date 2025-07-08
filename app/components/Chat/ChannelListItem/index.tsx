import {withObservables} from '@nozbe/watermelondb/react';
import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Pressable} from 'react-native';
import {localStore} from '../../../data';
import ChannelModel from '../../../db/channelModel';
import {observeChannelCount, observeUnreadCount} from '../../../db/helper';
import {StackNavigation} from '../../../navigators';
import {formatAMPM, moderateScale} from '../../../utils';
import {Avatar} from '../../Avatar';
import {Box} from '../../Box';
import {Text} from '../../Text';
import {DeliveryStatus} from '../DeliveryStatus';

type ChannelListItemProps = {
  channel: ChannelModel;
  count: ChannelModel[];
  unread: number;
};

const ChannelListItem = memo(({channel, unread}: ChannelListItemProps) => {
  const {UID} = localStore();
  const navigation = useNavigation<StackNavigation>();

  const onPress = () => {};
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({pressed}) => [pressed ? {opacity: 0.4} : {}]}>
        <Box flexDirection="row" gap="n">
          <Avatar
            uri={channel.channelSelfie}
            wnh={50}
            patientID={channel?.patient}
          />
          <Box paddingVertical="i" flex={1}>
            <Box flex={1} flexDirection="row" justifyContent="space-between">
              <Text
                color="primary"
                variant="semiBold"
                fontSize={moderateScale(15)}>
                {channel.channelName}
              </Text>
              <Box justifyContent="space-between">
                <Text color="darkLabel" fontSize={moderateScale(12)}>
                  {formatAMPM(channel.updatedAt)}
                </Text>
              </Box>
            </Box>
            <Box
              flex={1}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Box flex={2}>
                <Text
                  variant={unread > 0 ? 'medium' : 'regular'}
                  numberOfLines={1}
                  fontSize={moderateScale(14.5)}>
                  {channel.lastMessage}
                </Text>
              </Box>
              <Box flex={0.3} alignItems="flex-end">
                {channel.sender === UID ? (
                  <DeliveryStatus status={channel.deliverStatus} />
                ) : (
                  <>
                    {unread > 0 && (
                      <Box
                        borderRadius={100}
                        height={25}
                        width={25}
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="primary">
                        <Text
                          color="white"
                          variant="mSemiBold"
                          fontSize={moderateScale(12)}>
                          {unread}
                        </Text>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Pressable>
    </>
  );
});
const enhance = withObservables(['channel'], ({channel}) => ({
  count: observeChannelCount(),
  unread: observeUnreadCount(channel?.patient),
}));

export const EnhancedChannelList = enhance(ChannelListItem);
