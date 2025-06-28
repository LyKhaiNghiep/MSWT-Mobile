import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Pressable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {MarkCheck, Upload} from '../../assets/svgs';
import {Box, Text} from '../../components';
import {Header} from '../../components/Verification';
import {localStore} from '../../data';
import {StackNavigation} from '../../navigators';
import {spacing} from '../../theme/spacing';
import {moderateScale} from '../../utils';
import {$container, $scrollContainer, $selfieContainer} from './styles';
export const Document = () => {
  const navigation = useNavigation<StackNavigation>();
  const {selfie, qualification, addIdentityStep} = localStore();

  useEffect(() => {
    return () => {
      if (selfie && qualification) {
        addIdentityStep(true);
      }
    };
  }, [addIdentityStep, qualification, selfie]);

  return (
    <ScrollView style={$scrollContainer}>
      <Header title={'Identity\nVerification'} />
      <Box mt="xl" gap="ll" marginHorizontal="l">
        <Pressable
          onPress={() => navigation.navigate('Capture', {type: 'SELFIE'})}>
          <Box
            borderRadius={spacing.borderRadius}
            borderWidth={1.3}
            borderStyle="dashed"
            justifyContent="space-between"
            borderColor="secondary1Lighter"
            alignItems="center"
            p="m"
            backgroundColor="secondary1Light"
            style={$selfieContainer}>
            <Box alignItems="center">
              <Text
                variant="semiBold"
                fontSize={moderateScale(17)}
                color="primary">
                Identification Selfie
              </Text>
              <Text
                textAlign="center"
                variant="regular"
                lineHeight={19}
                pt="s"
                fontSize={moderateScale(12)}>
                A recent photo of yourself used for identification and
                verification purposes.
              </Text>
            </Box>

            {selfie ? (
              <Box
                borderRadius={100}
                backgroundColor="secondary1Lighter"
                justifyContent="center"
                alignItems="center"
                height={52}
                width={52}>
                <MarkCheck width={39} height={39} fill="#161528" />
              </Box>
            ) : (
              <Box
                borderRadius={100}
                backgroundColor="secondary1Lighter"
                justifyContent="center"
                alignItems="center"
                height={52}
                width={52}>
                <Upload />
              </Box>
            )}
          </Box>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Capture', {type: 'ID'})}>
          <Box
            borderRadius={spacing.borderRadius}
            borderWidth={1.3}
            borderStyle="dashed"
            justifyContent="space-between"
            borderColor="secondary2Lighter"
            alignItems="center"
            p="m"
            backgroundColor="secondary2Light"
            style={$container}>
            <Box alignItems="center">
              <Text
                variant="semiBold"
                fontSize={moderateScale(17)}
                color="primary">
                Proof of Qualification(s)
              </Text>
              <Text
                textAlign="center"
                variant="regular"
                lineHeight={19}
                pt="s"
                fontSize={moderateScale(12)}>
                Any official document that verifies your professional
                qualifications and expertise.
              </Text>
            </Box>

            {qualification ? (
              <Box
                borderRadius={100}
                backgroundColor="secondary2Lighter"
                justifyContent="center"
                alignItems="center"
                height={52}
                width={52}>
                <MarkCheck width={39} height={39} fill="#161528" />
              </Box>
            ) : (
              <Box
                borderRadius={100}
                backgroundColor="secondary2Lighter"
                justifyContent="center"
                alignItems="center"
                height={52}
                width={52}>
                <Upload />
              </Box>
            )}
          </Box>
        </Pressable>
      </Box>
    </ScrollView>
  );
};
