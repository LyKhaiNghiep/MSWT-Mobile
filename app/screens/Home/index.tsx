import React from 'react';
import {Screen, Text} from '../../components';

export const Home = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <Screen styles={{backgroundColor: 'white'}} useAlignment useDefault>
      <Text>Home</Text>
    </Screen>
  );
};
