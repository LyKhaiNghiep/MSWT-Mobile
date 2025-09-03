import React, {useState} from 'react';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {Card, SegmentedButtons, Text} from 'react-native-paper';
import {format} from 'date-fns';
import {useAlerts} from '../../hooks/useAlert';
import {AlertModel} from '../../config/models/alert.mode';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../navigators';

export const Notification = () => {
  const [selectedTab, setSelectedTab] = useState('new');
  const {alerts: notifications} = useAlerts();
  const navigation = useNavigation<StackNavigation>();

  const renderNotificationItem = ({item}: {item: AlertModel}) => (
    <Card
      style={styles.card}
      key={item.alertId}
      onPress={() =>
        navigation.navigate('NotificationDetails' as any, {id: item.alertId})
      }>
      <Card.Content>
        <Text variant="titleMedium" style={styles.status}>
          {item.status}
        </Text>
        <Text variant="bodyMedium">
          Thùng rác {item.trashBinId ? item.trashBinId.slice(-4) : '----'}
        </Text>
        <Text variant="bodyMedium">Vị trí: {item?.areaName}</Text>
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
          removeClippedSubviews={false}
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
