import {useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Divider, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useRequest, TRequest} from '../../hooks/useRequest';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'đã xử lý':
      return '#4CAF50';
    case 'từ chối':
      return '#F44336';
    case 'đang chờ xử lý':
      return '#FFC107';
    default:
      return '#757575';
  }
};

export default function RequestDetails() {
  const route = useRoute();
  const {data: requests} = useRequest();
  const id = (route.params as any).id;
  const request = requests.find(r => r.requestId === id);

  if (!request) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Chi tiết yêu cầu" />
        <View style={[styles.container, styles.centerContent]}>
          <Text>Không tìm thấy thông tin yêu cầu</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết yêu cầu" navigateTo="Request" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge">Yêu cầu </Text>
              <Text
                style={[
                  styles.status,
                  {color: getStatusColor(request.status)},
                ]}>
                {request.status}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium">Thông tin người gửi</Text>
              <Text variant="bodyLarge">Mã nhân viên: {request.workerId}</Text>
              {request.worker && (
                <Text variant="bodyLarge">Người gửi: {request.worker}</Text>
              )}
              <Text variant="bodyLarge">
                Ngày gửi: {format(new Date(request.requestDate), 'dd/MM/yyyy')}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium">Chi tiết yêu cầu</Text>
              {request.location && (
                <Text variant="bodyLarge">Vị trí: {request.location}</Text>
              )}
              {request.trashBin && (
                <Text variant="bodyLarge">Thùng rác: {request.trashBin}</Text>
              )}
              <Text variant="bodyLarge" style={styles.description}>
                Mô tả: {request.description}
              </Text>
            </View>

            {request.resolveDate && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text variant="titleMedium">Thông tin xử lý</Text>
                  {request.supervisor && (
                    <Text variant="bodyLarge">
                      Người xử lý: {request.supervisor}
                    </Text>
                  )}
                  <Text variant="bodyLarge">
                    Ngày xử lý:{' '}
                    {format(new Date(request.resolveDate), 'dd/MM/yyyy')}
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
  description: {
    lineHeight: 24,
  },
});
