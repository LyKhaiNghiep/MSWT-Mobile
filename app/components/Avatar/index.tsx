import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {spacing} from '../../theme/spacing';
import {Box} from '../Box';
import {$fastImage} from '../Timeline/styles';
import {$widthHeightStyle} from './styles';

export const Avatar = ({
  uri,
  wnh,
  patientID,
}: {
  uri?: string;
  wnh?: number;
  patientID?: string;
}) => {
  const [activeUsers, _] = useState<string>('');

  // const {uid} = useUser();

  // useEffect(() => {
  //   getOnlineUsers();
  // }, []);

  // const getOnlineUsers = async () => {
  //   const users = await associatedUsers();
  //   socket.emit('active', {users, me: uid});
  // };

  // socket.on('active', async data => {
  //   await getOnlineUsers();
  //   setActiveUser(data);
  // });

  return (
    <Box
      width={wnh ? wnh : 40}
      height={wnh ? wnh : 40}
      backgroundColor="primary"
      borderRadius={spacing.borderRadius}>
      <FastImage
        style={[$fastImage, $widthHeightStyle(wnh)]}
        source={{
          uri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      {activeUsers === patientID && (
        <Box
          backgroundColor="greenDark"
          width={13}
          height={13}
          bottom={-2}
          right={-4}
          position="absolute"
          borderRadius={100}
          borderColor="line"
        />
      )}
    </Box>
  );
};
