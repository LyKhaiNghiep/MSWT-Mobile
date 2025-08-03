import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, IconButton, Surface} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useTrashBins} from '../../hooks/useTrashbin';
import {colors} from '../../theme';
import {format} from 'date-fns';
import {TrashBinSensor} from '../../config/models/trashbin.model';

export default function TrashBinDetails() {
  const route = useRoute();
  const {trashbins2: trashbins} = useTrashBins();
  const id = (route.params as any).id;
  const trashbin = trashbins?.find(r => r.trashBinId === id);
  console.log('trashbin', trashbin);
  if (!trashbin) return null;

  const renderSensor = (sensor: TrashBinSensor) => (
    <Surface key={sensor.sensorId} style={styles.sensorSurface} elevation={2}>
      <Card style={styles.sensorCard}>
        <Card.Content style={styles.sensorContent}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorIconContainer}>
              <IconButton icon="gauge" size={24} iconColor={colors.primary} />
            </View>
            <View style={styles.sensorInfo}>
              <Text variant="titleMedium">{sensor.sensorName || 'Sensor'}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết thùng rác" navigateTo="Trash" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Tên thùng rác:</Text>
              <Text variant="bodyLarge">{trashbin.trashBinName || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Khu vực:</Text>
              <Text variant="bodyLarge">{trashbin.location || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Trạng thái:</Text>
              <Text variant="bodyLarge">{trashbin.status}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Ngày tạo:</Text>
              <Text variant="bodyLarge">
                {trashbin.createdAt
                  ? format(new Date(trashbin.createdAt), 'dd/MM/yyyy HH:mm')
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Cập nhật lần cuối:</Text>
              <Text variant="bodyLarge">
                {trashbin.updatedAt
                  ? format(new Date(trashbin.updatedAt), 'dd/MM/yyyy HH:mm')
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.description}>
              <Text variant="labelLarge">Mô tả:</Text>
              <Text variant="bodyLarge" style={styles.descriptionText}>
                {trashbin.description || 'Không có mô tả'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.sensorsSection}>
          <Text variant="headlineSmall" style={styles.sensorTitle}>
            Danh sách cảm biến
          </Text>
          {trashbin.sensors && trashbin.sensors.length > 0 ? (
            trashbin.sensors.map(sensor => renderSensor(sensor))
          ) : (
            <Text variant="bodyLarge" style={styles.noSensors}>
              Không có cảm biến nào
            </Text>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  card: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary1Light,
  },
  description: {
    marginTop: 16,
  },
  descriptionText: {
    marginTop: 8,
    color: colors.darkLabel,
  },
  sensorsSection: {
    marginTop: 16,
  },
  sensorTitle: {
    marginBottom: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  sensorSurface: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sensorCard: {
    backgroundColor: colors.white,
  },
  sensorContent: {
    padding: 16,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sensorIconContainer: {
    backgroundColor: colors.primary + '15',
    borderRadius: 20,
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sensorValue: {
    flex: 1,
  },
  sensorStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  noSensors: {
    textAlign: 'center',
    color: 'red',
    marginTop: 16,
  },
});
