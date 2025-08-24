import {useRoute} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useTrashBins} from '../../hooks/useTrashbin';
import {useAreas} from '../../hooks/useArea';
import {colors} from '../../theme';

export default function TrashBinDetails() {
  const route = useRoute();
  const {trashbins} = useTrashBins();
  const {areas} = useAreas();
  const id = (route.params as any).id;
  const trashbin = trashbins?.find(r => r.trashBinId === id);

  // Get area name from areaId
  const areaName = useMemo(() => {
    if (!trashbin?.areaId || !areas) {
      return null;
    }
    const area = areas.find(a => a.areaId === trashbin.areaId);
    return area?.areaName || `Khu vực ${trashbin.areaId.slice(-4)}`;
  }, [trashbin?.areaId, areas]);

  if (!trashbin) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hoạt động':
        return colors.blueDark;
      case 'bảo trì':
        return colors.warning;
      case 'ngưng hoạt động':
        return colors.error;
      default:
        return colors.subLabel;
    }
  };

  return (
    <Screen styles={{backgroundColor: colors.white}} useDefault>
      <AppHeader title="Chi tiết thùng rác" navigateTo="Trash" />
      <ScrollView style={styles.container}>
        {/* Upper Card - Trash Bin Information */}
        <Card style={styles.mainCard} mode="elevated">
          <Card.Content>
            <View style={styles.headerSection}>
              <View style={styles.titleSection}>
                <Text variant="headlineSmall" style={styles.title}>
                  Thùng rác {trashbin.trashBinId.slice(-4)}
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
                  Khu vực:
                </Text>
                <Text variant="bodyLarge" style={styles.value}>
                  {areaName || 'N/A'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Note: Sensor functionality removed as it's not available in current API */}
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
  // Removed unused sensor-related styles as sensors are not available in current API
});
