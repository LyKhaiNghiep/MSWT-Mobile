import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Button, Card, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Leave} from '../../config/models/leave.model';
import {format} from 'date-fns';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';
const sampleLeaves: Leave[] = [
  {
    leaveType: 1,
    startDate: '2024-02-01T00:00:00.000Z',
    endDate: '2024-02-03T00:00:00.000Z',
    reason: 'Nghỉ phép năm 2024',
  },
  {
    leaveType: 2,
    startDate: '2024-02-10T00:00:00.000Z',
    endDate: '2024-02-11T00:00:00.000Z',
    reason: 'Nghỉ ốm để khám bệnh',
  },
  {
    leaveType: 3,
    startDate: '2024-02-15T00:00:00.000Z',
    endDate: '2024-02-16T00:00:00.000Z',
    reason: 'Nghỉ không lương vì việc cá nhân',
  },
];
const getLeaveTypeName = (type: number) => {
  switch (type) {
    case 1:
      return 'Nghỉ phép năm';
    case 2:
      return 'Nghỉ ốm';
    case 3:
      return 'Nghỉ không lương';
    default:
      return 'Khác';
  }
};

export default function LeaveRequest() {
  const navigation = useNavigation<StackNavigation>();
  const [leaves, setLeaves] = React.useState<Leave[]>(sampleLeaves); // This should be replaced with actual API call

  const renderLeaveItem = ({item}: {item: Leave}) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('LeaveDetails')}>
      <Card.Content>
        <Text variant="titleMedium">{getLeaveTypeName(item.leaveType)}</Text>
        <Text variant="bodyMedium">
          Từ: {format(new Date(item.startDate), 'dd/MM/yyyy')}
        </Text>
        <Text variant="bodyMedium">
          Đến: {format(new Date(item.endDate), 'dd/MM/yyyy')}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2}>
          Lý do: {item.reason}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Đơn xin nghỉ phép" />
      <View style={styles.container}>
        <FlatList
          data={leaves}
          renderItem={renderLeaveItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có đơn xin nghỉ nào</Text>
          }
          removeClippedSubviews={false}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('CreateLeaveRequest')}>
          Tạo đơn xin nghỉ
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.mainColor,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
});
