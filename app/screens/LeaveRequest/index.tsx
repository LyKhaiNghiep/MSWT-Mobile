import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Button, Card, Text, Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Leave} from '../../config/models/leave.model';
import {format} from 'date-fns';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';
import {useLeaveRequest} from '../../hooks/useLeaveRequest';

export default function LeaveRequest() {
  const navigation = useNavigation<StackNavigation>();
  const {myLeaves: leaves, getLeaveTypeLabel} = useLeaveRequest();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'đã duyệt':
        return '#4CAF50';
      case 'từ chối':
        return '#F44336';
      case 'đang chờ duyệt':
        return '#FFC107';
      default:
        return '#757575';
    }
  };

  const renderLeaveItem = ({item}: {item: Leave}) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('LeaveDetails' as any, {id: item.leaveId})
      }>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{getLeaveTypeLabel(item.leaveType)}</Text>
          <Badge
            style={[
              styles.badge,
              {backgroundColor: getStatusColor(item.approvalStatus)},
            ]}>
            {item.approvalStatus}
          </Badge>
        </View>
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
          keyExtractor={item => item.leaveId}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
  },
});
