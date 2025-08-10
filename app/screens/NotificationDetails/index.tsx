import {useRoute, useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Divider, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useAlerts} from '../../hooks/useAlert';
import {API_URLS} from '../../constants/api-urls';
import api from '../../services/api';
import {showSnackbar} from '../../utils/snackbar';
import {StackNavigation} from '../../navigators';

export default function NotificationDetails() {
  const route = useRoute();
  const navigation = useNavigation<StackNavigation>();
  const {alerts} = useAlerts();
  const id = (route.params as any).id;
  const alert = alerts.find(r => r.alertId === id);

  const handleResolve = async () => {
    try {
      await api.put(API_URLS.ALERTS.RESOLVE(id));

      // Show success message
      showSnackbar?.success('Đã xử lý thông báo');
      navigation.navigate('Notification');

      // Navigate back
    } catch (error) {
      showSnackbar?.error('Không thể xử lý thông báo. Vui lòng thử lại');
    }
  };

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

              <Text variant="bodyLarge">Vị trí: {alert.areaName}</Text>
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

            {!alert.resolvedAt && (
              <>
                <Divider style={styles.divider} />
                <Button
                  mode="contained"
                  onPress={handleResolve}
                  style={styles.resolveButton}>
                  Đã xử lý
                </Button>
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
  resolveButton: {
    marginTop: 8,
  },
});
