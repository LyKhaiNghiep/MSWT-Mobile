import React, {useState} from 'react';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {FlatList, StyleSheet, View} from 'react-native';
import {Card, SegmentedButtons, Text} from 'react-native-paper';
import {format} from 'date-fns';

interface Alert {
  alertId: string;
  trashBinId: string;
  timeSend: string;
  resolvedAt: string | null;
  userId: string | null;
  status: string;
  trashBin: any | null;
  user: any | null;
}

const sampleNotifications: Alert[] = [
  {
    alertId: 'AL0f33cafa-2a6d-4458-b2a5-6635f2917ac4',
    trashBinId: 'TB638875466277997005',
    timeSend: '2024-02-15T09:30:00.000Z',
    resolvedAt: null,
    userId: null,
    status: 'Cần dọn dẹp',
    trashBin: null,
    user: null,
  },
  {
    alertId: 'AL638880893772331999',
    trashBinId: 'TB638875466277997006',
    timeSend: '2024-02-15T10:15:00.000Z',
    resolvedAt: '2024-02-15T11:30:00.000Z',
    userId: 'USER123',
    status: 'Cần được xử lý',
    trashBin: null,
    user: null,
  },
  {
    alertId: 'AL638880893970278281',
    trashBinId: 'TB638875466277997007',
    timeSend: '2024-02-15T14:20:00.000Z',
    resolvedAt: null,
    userId: null,
    status: 'Cần được xử lý',
    trashBin: null,
    user: null,
  },
  {
    alertId: 'AL638880894123456789',
    trashBinId: 'TB638875466277997008',
    timeSend: '2024-02-14T16:45:00.000Z',
    resolvedAt: '2024-02-14T17:30:00.000Z',
    userId: 'USER456',
    status: 'Cần dọn dẹp',
    trashBin: null,
    user: null,
  },
];

export const Notification = () => {
  const [selectedTab, setSelectedTab] = useState('new');
  const [notifications, setNotifications] =
    useState<Alert[]>(sampleNotifications); // Replace with actual API call

  const renderNotificationItem = ({item}: {item: Alert}) => (
    <Card style={styles.card} key={item.alertId}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.status}>
          {item.status}
        </Text>
        <Text variant="bodyMedium">Thùng rác: {item.trashBinId}</Text>
        <Text variant="bodyMedium">
          Thời gian: {format(new Date(item.timeSend), 'dd/MM/yyyy HH:mm')}
        </Text>
        {item.resolvedAt && (
          <Text variant="bodyMedium">
            Đã xử lý: {format(new Date(item.resolvedAt), 'dd/MM/yyyy HH:mm')}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const filteredNotifications = notifications.filter(notification =>
    selectedTab === 'new' ? !notification.resolvedAt : notification.resolvedAt,
  );

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Thông báo" />
      <View style={styles.container}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            {value: 'new', label: 'Mới'},
            {value: 'resolved', label: 'Đã xử lý'},
          ]}
          style={styles.segmentedButtons}
        />
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.alertId}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {selectedTab === 'new'
                ? 'Không có thông báo mới'
                : 'Không có thông báo đã xử lý'}
            </Text>
          }
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 8,
  },
  status: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
});
