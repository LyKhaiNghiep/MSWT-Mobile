import auth from '@react-native-firebase/auth';
import React from 'react';
import {Lock, Logout, Trash, Verified} from '../../assets/svgs';
import {Avatar, Box, ProfileItem, Screen, Text} from '../../components';
import {Header} from '../../components/Verification';
import {localStore, storage} from '../../data';
import {colors} from '../../theme';
import {spacing} from '../../theme/spacing';
import {formatDate, moderateScale} from '../../utils';

export const Profile = () => {
  //specialty, gender,
  const {fullName, email,dob} = localStore();
  const signOut = async () => {
    await auth().signOut();
    storage.clearAll();
  };
  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault={false}>
      <Box backgroundColor="grey" flex={1} paddingHorizontal="l">
        <Box mt="l">
          <Header addDefault={false} title="Profile" summary=" " />
        </Box>
        <Box gap="ll">
          <Box
            paddingVertical="m"
            paddingHorizontal="n"
            backgroundColor="white"
            borderRadius={spacing.borderRadius}
            gap="n"
            flexDirection="row"
            alignItems="center">
            <Avatar wnh={45} />
            <Box gap="n">
              <Box gap="s" alignItems="center" flexDirection="row">
                <Text
                  color="primary"
                  variant="medium"
                  letterSpacing={0.2}
                  fontSize={moderateScale(15)}
                  adjustsFontSizeToFit>
                  {fullName}
                </Text>
                <Verified />
              </Box>
              <Text color="darkLabel">Dentist</Text>
            </Box>
          </Box>

          <Box>
            <Box
              paddingVertical="l"
              paddingHorizontal="n"
              backgroundColor="white"
              borderRadius={spacing.borderRadius}>
              <Box flexDirection="row" justifyContent="space-between">
                <Text
                  fontSize={moderateScale(15)}
                  color="primary"
                  variant="medium">
                  Email
                </Text>

                <Text adjustsFontSizeToFit>{email}</Text>
              </Box>
              <Box marginVertical="m" height={0.7} backgroundColor="grey" />

              <Box flexDirection="row" justifyContent="space-between">
                <Text
                  fontSize={moderateScale(15)}
                  color="primary"
                  variant="medium">
                  DOB
                </Text>
                <Text adjustsFontSizeToFit>{formatDate(dob)}</Text>
              </Box>
              <Box marginVertical="m" height={0.7} backgroundColor="grey" />

              <Box flexDirection="row" justifyContent="space-between">
                <Text
                  fontSize={moderateScale(15)}
                  color="primary"
                  variant="medium">
                  Gender
                </Text>
                <Text adjustsFontSizeToFit>Male</Text>
              </Box>
            </Box>
          </Box>
          <Box gap="l">
            <ProfileItem
              bg="primary"
              icon={<Lock />}
              title="Privacy Policy"
              onPress={() => {}}
            />
            <ProfileItem
              bg="palePinkDark"
              icon={<Trash />}
              title="Delete Account"
              onPress={() => {}}
            />
            <ProfileItem
              bg="blueDark"
              icon={<Logout />}
              title="Logout"
              onPress={signOut}
            />
          </Box>
        </Box>
      </Box>
    </Screen>
  );
};
