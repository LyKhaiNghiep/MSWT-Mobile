import React from 'react';
import {Screen, Text} from '../../components';
import {AppHeader} from '../../components/AppHeader';

export const Notification = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Thông báo" />
    </Screen>
  );
};
