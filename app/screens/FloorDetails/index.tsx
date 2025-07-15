import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, Badge} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useFloors} from '../../hooks/useFloor';
import {colors} from '../../theme';

export default function FloorDetails() {
  const route = useRoute();
  const {floors} = useFloors();
  const id = (route.params as any).id;
  const floor = floors?.find(r => r.floorId === id);

  if (!floor) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đang hoạt động':
        return colors.success;
      case 'bảo trì':
        return colors.warning;
      case 'ngưng hoạt động':
        return colors.error;
      default:
        return colors.subLabel;
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết tầng" navigateTo="Floor" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Số tầng:</Text>
              <Text variant="bodyLarge">{floor.floorNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Trạng thái:</Text>
              <Badge
                style={[
                  {
                    backgroundColor: getStatusColor(floor.status),
                    alignSelf: 'center',
                  },
                ]}>
                {floor.status}
              </Badge>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Số phòng vệ sinh:</Text>
              <Text variant="bodyLarge">{floor.numberOfRestroom}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Số thùng rác:</Text>
              <Text variant="bodyLarge">{floor.numberOfBin}</Text>
            </View>

            <View style={styles.description}>
              <Text variant="labelLarge">Mô tả:</Text>
              <Text variant="bodyLarge" style={styles.descriptionText}>
                {floor.description || 'Không có mô tả'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.areaCard]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.areaTitle}>
              Danh sách khu vực
            </Text>
            {floor.areas && floor.areas.length > 0 ? (
              floor.areas.map(area => (
                <View key={area.areaId} style={styles.areaItem}>
                  <View style={styles.areaHeader}>
                    <Text variant="titleMedium">{area.areaName}</Text>
                    <Badge
                      style={[
                        {
                          backgroundColor: getStatusColor(area.status),
                        },
                      ]}>
                      {area.status}
                    </Badge>
                  </View>
                  <View style={styles.areaDetails}>
                    <Text variant="bodyMedium">
                      Phòng: {area.roomBegin} - {area.roomEnd}
                    </Text>
                    <Text variant="bodyMedium" style={styles.areaDescription}>
                      {area.description || 'Không có mô tả'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text variant="bodyLarge" style={styles.emptyText}>
                Không có khu vực nào
              </Text>
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
  areaCard: {
    marginTop: 8,
  },
  areaTitle: {
    marginBottom: 16,
    color: colors.primary,
  },
  areaItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.secondary1Light,
    borderRadius: 8,
  },
  areaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  areaDetails: {
    gap: 4,
  },
  areaDescription: {
    color: colors.darkLabel,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.subLabel,
  },
});
