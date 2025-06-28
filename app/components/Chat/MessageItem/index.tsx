import {withObservables} from '@nozbe/watermelondb/react';
import React from 'react';
import {observeDeliveryStatus} from '../../../db/helper';
import MessagesModel from '../../../db/messagesModel';
import {spacing} from '../../../theme/spacing';
import {formatAMPM, moderateScale} from '../../../utils';
import {Box} from '../../Box';
import {Text} from '../../Text';
import {DeliveryStatus} from '../DeliveryStatus';

type MessageItemProps = {
  item: MessagesModel;
  UID: string;
  status?: MessagesModel[];
};
const MessageItem = ({item, UID}: MessageItemProps) => {
  return (
    <Box
      maxWidth={'85%'}
      alignSelf={item.sender === UID ? 'flex-end' : 'flex-start'}>
      <Box
        backgroundColor={item.sender === UID ? 'chatSender' : 'line'}
        marginVertical="s"
        flexWrap="wrap"
        flexDirection="row"
        paddingHorizontal="n"
        paddingVertical="xs"
        overflow="hidden"
        borderRadius={spacing.borderRadius}>
        <Text
          variant="regular"
          color="primary"
          pr="xs"
          pb="ii"
          fontSize={moderateScale(16)}>
          {item.message}
        </Text>
        <Box
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="flex-end"
          flexGrow={1}>
          <Text fontSize={moderateScale(12)} color="formLabel">
            {formatAMPM(item?.createdAt)}
          </Text>
          {item.sender === UID && (
            <Box pl="ii" alignItems="flex-end">
              <DeliveryStatus status={item.deliveryStatus} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const enhance = withObservables([], () => ({
  status: observeDeliveryStatus(),
}));
export const EnhancedMessageItem = enhance(MessageItem);
