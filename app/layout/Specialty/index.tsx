import React, {useEffect} from 'react';
import {Dimensions, Pressable, ScrollView} from 'react-native';
import {BounceInUp} from 'react-native-reanimated';
import {FlatGrid} from 'react-native-super-grid';
import {
  Cardiology,
  Dentist,
  Gastrology,
  General,
  Gynecology,
  Lungs,
  Nephrology,
  Neurology,
  Ophthalmology,
  Orthopedics,
  Pediatrics,
} from '../../assets/svgs';
import {AnimatedBox, Box, Text} from '../../components';
import {Header} from '../../components/Verification';
import {localStore} from '../../data';
import {spacing} from '../../theme/spacing';
import {moderateScale} from '../../utils';

export const Specialty = () => {
  const {specialty, addSpecialty, addSpecialtyStep} = localStore();
  const width = Dimensions.get('window').width - 38;
  const ITEM = [
    {
      title: 'Cardiology',
      icon: <Cardiology />,
      color: {light: 'orangeLight', dark: 'orangeDark'},
    },
    {
      title: 'Dentistry',
      icon: <Dentist />,
      color: {light: 'greenLight', dark: 'greenDark'},
    },
    {
      title: 'Neurology',
      icon: <Neurology />,
      color: {light: 'purpleLight', dark: 'purpleDark'},
    },
    {
      title: 'Pulmonology',
      icon: <Lungs />,
      color: {light: 'blueLight', dark: 'blueDark'},
    },
    {
      title: 'Pediatrics',
      icon: <Pediatrics />,
      color: {light: 'goldLight', dark: 'goldDark'},
    },
    {
      title: 'General',
      icon: <General />,
      color: {light: 'deepGreenLight', dark: 'deepGreenDark'},
    },
    {
      title: 'Orthopedics',
      icon: <Orthopedics />,
      color: {light: 'cyan', dark: 'cyanDark'},
    },
    {
      title: 'Gastrology',
      icon: <Gastrology />,
      color: {light: 'palePink', dark: 'palePinkDark'},
    },
    {
      title: 'Nephrology',
      icon: <Nephrology />,
      color: {light: 'ivoryLight', dark: 'ivoryDark'},
    },
    {
      title: 'Ophthalmology',
      icon: <Ophthalmology />,
      color: {light: 'icyBlue', dark: 'icyDark'},
    },
    {
      title: 'Gynecology',
      icon: <Gynecology />,
      color: {light: 'softPink', dark: 'softPinkDark'},
    },
  ];

  const onPress = (title: string) => {
    if (title === specialty) {
      addSpecialty('');
    } else {
      addSpecialty(title);
    }
  };
  useEffect(() => {
    addSpecialtyStep(false);
    return () => {
      if (specialty.length > 0) {
        addSpecialtyStep(true);
      }
    };
  }, [addSpecialtyStep, specialty.length]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Header
        title={'Professional\nSpecialty'}
        summary="Select your area of expertise to match with the right patients."
      />
      <FlatGrid
        itemDimension={width / 2 - 15}
        spacing={10}
        fixed={true}
        scrollEnabled={false}
        data={ITEM}
        renderItem={({item: {color, icon, title}}) => (
          <Pressable onPress={() => onPress(title)}>
            <AnimatedBox
              layout={BounceInUp}
              key={title}
              borderRadius={spacing.borderRadius}
              alignItems="center"
              height={170}
              borderWidth={specialty && specialty === title ? 3 : 0}
              borderColor={
                specialty && specialty === title ? color.dark : undefined
              }
              mt="m"
              pt="ll"
              justifyContent="space-between"
              backgroundColor={color.light}>
              <Box>{icon}</Box>

              <Text
                fontSize={moderateScale(17)}
                variant="semiBold"
                paddingBottom="l"
                color="primary">
                {title}
              </Text>
            </AnimatedBox>
          </Pressable>
        )}
      />
    </ScrollView>
  );
};
