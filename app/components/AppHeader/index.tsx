import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Appbar, IconButton} from 'react-native-paper';
import {NavigationTabProps, ScreenName} from '../../config/types';
import {colors} from '../../theme';
import {Box} from '../Box';
import {StackNavigation} from '../../navigators';

type AppHeaderProps = {
  title?: string;
  showLogo?: boolean;
  style?: any;
  navigateTo?: ScreenName;
};

export const AppHeader = ({
  title,
  style,
  showLogo = false,
  navigateTo = 'Home',
}: AppHeaderProps) => {
  const navigation = useNavigation<StackNavigation>();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(navigateTo);
    }
  };

  return (
    <Appbar.Header style={[styles.header, style]}>
      {title && (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}>
          <IconButton
            icon="arrow-left"
            iconColor={colors.white}
            size={30}
            onPress={handleGoBack}
          />
          <Appbar.Content title={title} titleStyle={styles.headerTitle} />
          <IconButton
            icon="arrow-right"
            iconColor={colors.white}
            size={30}
            style={{opacity: 0}}
          />
        </Box>
      )}
      {showLogo && (
        <Box
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/logo-fpt.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </Box>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.mainColor,
    elevation: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: {
    width: 100, // Adjust this value as needed
    height: 40, // Adjust this value as needed
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});
