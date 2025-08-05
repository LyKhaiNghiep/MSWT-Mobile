import {useRoute} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, IconButton, Surface} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useTrashBins} from '../../hooks/useTrashbin';
import {useRestrooms} from '../../hooks/useRestroom';
import {colors} from '../../theme';

import {TrashBinSensor} from '../../config/models/trashbin.model';

export default function TrashBinDetails() {
  const route = useRoute();
  const {trashbins2: trashbins} = useTrashBins();
  const {restrooms} = useRestrooms();
  const id = (route.params as any).id;
  const trashbin = trashbins?.find(r => r.trashBinId === id);

  // Get restroom name from restroomId
  const restroomName = useMemo(() => {
    if (!trashbin?.restroomId || !restrooms) return null;
    const restroom = restrooms.find(r => r.restroomId === trashbin.restroomId);
    return restroom?.restroomNumber || restroom?.restroomId || null;
  }, [trashbin?.restroomId, restrooms]);

  if (!trashbin) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hoạt động':
        return colors.success;
      case 'bảo trì':
        return colors.warning;
      case 'ngưng hoạt động':
        return colors.error;
      default:
        return colors.subLabel;
    }
  };

  const getSensorIcon = (sensorName: string) => {
    const name = sensorName?.toLowerCase() || '';
    if (name.includes('chuyển động') || name.includes('motion')) {
      return 'motion-sensor';
    }
    if (name.includes('siêu âm') || name.includes('ultrasonic')) {
      return 'wave';
    }
    if (name.includes('nhiệt độ') || name.includes('temperature')) {
      return 'thermometer';
    }
    if (name.includes('độ ẩm') || name.includes('humidity')) {
      return 'water-percent';
    }
    if (name.includes('ánh sáng') || name.includes('light')) {
      return 'brightness-6';
    }
    return 'sensors';
  };

  const renderSensor = (sensor: TrashBinSensor) => (
    <Surface key={sensor.sensorId} style={styles.sensorSurface} elevation={2}>
      <Card style={styles.sensorCard}>
        <Card.Content style={styles.sensorContent}>
          <View style={styles.sensorHeader}>
            <View style={styles.sensorIconContainer}>
              <IconButton
                icon={getSensorIcon(sensor.sensorName)}
                size={24}
                iconColor={colors.primary}
              />
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
        {/* Upper Card - Trash Bin Information */}
        <Card style={styles.mainCard} mode="elevated">
          <Card.Content>
            <View style={styles.headerSection}>
              <View style={styles.titleSection}>
                <Text variant="headlineSmall" style={styles.title}>
                  {trashbin.trashBinName || trashbin.location || 'Thùng rác'}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(trashbin.status)},
                  ]}>
                  <Text style={styles.statusBadgeText}>{trashbin.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>
                  ID thùng rác:
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {trashbin.trashBinId}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>
                  Vị trí:
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {trashbin.location || 'N/A'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>
                  Khu vực:
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {trashbin.areaName || 'N/A'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="labelLarge" style={styles.label}>
                  Nhà vệ sinh:
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {trashbin.restroomId
                    ? restroomName || trashbin.restroomId
                    : 'Không có'}
                </Text>
              </View>

              {trashbin.description && (
                <View style={styles.descriptionSection}>
                  <Text variant="labelLarge" style={styles.label}>
                    Mô tả:
                  </Text>
                  <Text variant="bodyLarge" style={styles.descriptionText}>
                    {trashbin.description}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Lower Section - Sensors */}
        <View style={styles.sensorsSection}>
          <Text variant="headlineSmall" style={styles.sensorTitle}>
            Danh sách cảm biến ({trashbin.sensors?.length || 0})
          </Text>
          {trashbin.sensors && trashbin.sensors.length > 0 ? (
            trashbin.sensors.map(sensor => renderSensor(sensor))
          ) : (
            <Surface style={styles.noSensorsSurface} elevation={1}>
              <Card style={styles.noSensorsCard}>
                <Card.Content style={styles.noSensorsContent}>
                  <IconButton
                    icon="gauge-empty"
                    size={48}
                    iconColor={colors.subLabel}
                  />
                  <Text variant="bodyLarge" style={styles.noSensorsText}>
                    Không có cảm biến nào
                  </Text>
                </Card.Content>
              </Card>
            </Surface>
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
  mainCard: {
    marginBottom: 24,
    backgroundColor: colors.white,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 24,
  },
  statusBadgeText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary1Light,
    marginBottom: 16,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    color: colors.subLabel,
    fontWeight: '600',
    flex: 1,
  },
  value: {
    color: colors.darkLabel,
    flex: 1,
    textAlign: 'right',
  },
  descriptionSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.secondary1Light,
  },
  descriptionText: {
    marginTop: 8,
    color: colors.darkLabel,
    lineHeight: 20,
  },
  sensorsSection: {
    marginBottom: 24,
  },
  sensorTitle: {
    marginBottom: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  sensorSurface: {
    marginBottom: 12,
    borderRadius: 12,
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
  },
  sensorIconContainer: {
    backgroundColor: colors.primary + '15',
    borderRadius: 20,
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  noSensorsSurface: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  noSensorsCard: {
    backgroundColor: colors.white,
  },
  noSensorsContent: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  noSensorsText: {
    textAlign: 'center',
    color: colors.subLabel,
  },
});
