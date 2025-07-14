import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Card, Divider, Text} from 'react-native-paper';
import {format} from 'date-fns';
import {Leave} from '../../config/models/leave.model';

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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return '#4CAF50';
    case 'rejected':
      return '#F44336';
    case 'pending':
      return '#FFC107';
    default:
      return '#757575';
  }
};

export default function LeaveRequestDetails() {
  // This should be replaced with actual API call or route params
  const leaveRequest: Leave & {status: string} = {
    leaveType: 1,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    reason: 'Nghỉ phép năm 2024',
    status: 'pending',
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết đơn" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge">
                {getLeaveTypeName(leaveRequest.leaveType)}
              </Text>
              <Text
                style={[
                  styles.status,
                  {color: getStatusColor(leaveRequest.status)},
                ]}>
                {leaveRequest.status === 'approved'
                  ? 'Đã duyệt'
                  : leaveRequest.status === 'rejected'
                  ? 'Từ chối'
                  : 'Đang chờ'}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium">Thời gian nghỉ</Text>
              <View style={styles.dateContainer}>
                <Text variant="bodyLarge">
                  Từ: {format(new Date(leaveRequest.startDate), 'dd/MM/yyyy')}
                </Text>
                <Text variant="bodyLarge">
                  Đến: {format(new Date(leaveRequest.endDate), 'dd/MM/yyyy')}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium">Lý do</Text>
              <Text variant="bodyLarge" style={styles.reason}>
                {leaveRequest.reason}
              </Text>
            </View>

            {leaveRequest.status !== 'pending' && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text variant="titleMedium">Phản hồi</Text>
                  <Text variant="bodyLarge" style={styles.feedback}>
                    {leaveRequest.status === 'approved'
                      ? 'Đơn xin nghỉ của bạn đã được chấp nhận'
                      : 'Đơn xin nghỉ của bạn đã bị từ chối'}
                  </Text>
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    gap: 8,
  },
  dateContainer: {
    gap: 4,
  },
  reason: {
    lineHeight: 24,
  },
  feedback: {
    fontStyle: 'italic',
  },
});
