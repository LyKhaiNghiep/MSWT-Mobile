import {useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Divider, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useLeaveRequest} from '../../hooks/useLeaveRequest';
import {useUsers} from '../../hooks/useUsers';

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

export default function LeaveRequestDetails() {
  const route = useRoute();
  const {getLeaveById} = useLeaveRequest();
  const {users} = useUsers();
  const id = (route.params as any).id;
  const leaveRequest = getLeaveById(id);

  // Helper function to get user name by user ID
  const getUserName = (userId: string | null): string => {
    if (!userId) return 'Không rõ';
    const user = users.find(u => u.userId === userId);
    return user?.fullName || user?.userName || userId;
  };

  if (!leaveRequest) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Chi tiết đơn" />
        <View style={[styles.container, styles.centerContent]}>
          <Text>Không tìm thấy thông tin đơn nghỉ phép</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết đơn" navigateTo="LeaveRequest" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge">{leaveRequest.leaveType}</Text>
              <Text
                style={[
                  styles.status,
                  {color: getStatusColor(leaveRequest.approvalStatus)},
                ]}>
                {leaveRequest.approvalStatus}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium">Thông tin người gửi</Text>
              <Text variant="bodyLarge">
                Người gửi: {getUserName(leaveRequest.workerId)}
              </Text>
              <Text variant="bodyLarge">
                Mã nhân viên: {leaveRequest.workerId}
              </Text>
              <Text variant="bodyLarge">
                Ngày gửi:{' '}
                {format(new Date(leaveRequest.requestDate), 'dd/MM/yyyy')}
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
                <Text variant="bodyLarge">
                  Tổng số ngày: {leaveRequest.totalDays}
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

            {leaveRequest.approvalStatus !== 'Đang chờ duyệt' && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text variant="titleMedium">Thông tin phê duyệt</Text>
                  <Text variant="bodyLarge">
                    Người duyệt: {getUserName(leaveRequest.approvedBy)}
                  </Text>
                  <Text variant="bodyLarge">
                    Ngày duyệt:{' '}
                    {format(new Date(leaveRequest.approvalDate!), 'dd/MM/yyyy')}
                  </Text>
                  {leaveRequest.note && (
                    <Text variant="bodyLarge" style={styles.feedback}>
                      Ghi chú: {leaveRequest.note}
                    </Text>
                  )}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
