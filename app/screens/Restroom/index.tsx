import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';

export default function Restroom() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Nhà về sinh" />
    </Screen>
  );
}
