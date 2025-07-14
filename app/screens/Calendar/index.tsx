import React from 'react';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';

export default function Calendar() {
  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Lịch làm việc" />
    </Screen>
  );
}
