import {useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Divider, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useAlerts} from '../../hooks/useAlert';

export default function NotificationDetails() {
  const route = useRoute();
  const {alerts} = useAlerts();
  const id = (route.params as any).id;
  const alert = alerts.find(r => r.alertId === id);

  if (!alert) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Thông báo" />
        <View style={[styles.container, styles.centerContent]}>
          <Text>Không tìm thấy thông báo</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết thông báo" navigateTo="Notification" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge" style={[styles.status]}>
                {alert.status}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="titleMedium">Thông tin thùng rác</Text>
              <Text variant="bodyLarge">
                Mã thùng: {alert.trashBin.trashBinName}
              </Text>
              <Text variant="bodyLarge">Vị trí: {alert.trashBin.areaName}</Text>
              <Text variant="bodyLarge">
                Thời gian gửi:{' '}
                {format(new Date(alert.timeSend), 'dd/MM/yyyy HH:mm')}
              </Text>
            </View>

            {alert.resolvedAt && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoSection}>
                  <Text variant="titleMedium">Thông tin xử lý</Text>
                  {alert.user && (
                    <Text variant="bodyLarge">
                      Người xử lý: {alert.user.fullName}
                    </Text>
                  )}
                  <Text variant="bodyLarge">
                    Thời gian xử lý:{' '}
                    {format(new Date(alert.resolvedAt), 'dd/MM/yyyy HH:mm')}
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
});
