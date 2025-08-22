import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, Badge} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useAreas} from '../../hooks/useArea';
import {colors} from '../../theme';

export default function AreaDetails() {
  const route = useRoute();
  const {areas} = useAreas();
  const id = (route.params as any).id;
  const area = areas?.find(r => r.areaId === id);

  if (!area) {
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
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết khu vực" navigateTo="Floor" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Tên khu vực:</Text>
              <Text variant="bodyLarge">{area.areaName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Trạng thái:</Text>
              <Badge
                style={[
                  {
                    width: 100,
                    textAlign: 'center',
                    color: 'white',
                    borderRadius: 10,
                    backgroundColor: getStatusColor(area.status),
                    alignSelf: 'center',
                  },
                ]}>
                {area.status}
              </Badge>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Số phòng:</Text>
              <Text variant="bodyLarge">{area.rooms?.length || 0}</Text>
            </View>

            <View style={styles.description}>
              <Text variant="labelLarge">Mô tả:</Text>
              <Text variant="bodyLarge" style={styles.descriptionText}>
                {area.description || 'Không có mô tả'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.areaCard]}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.areaTitle}>
              Danh sách phòng
            </Text>
            {area.rooms && area.rooms.length > 0 ? (
              area.rooms.map(room => (
                <View key={room.roomId} style={styles.areaItem}>
                  <View style={styles.areaHeader}>
                    <Text variant="titleMedium">Phòng {room.roomNumber}</Text>
                    <Badge
                      style={[
                        {
                          backgroundColor: getStatusColor(room.status),
                          width: 100,
                          textAlign: 'center',
                          color: 'white',
                          borderRadius: 10,
                        },
                      ]}>
                      {room.status}
                    </Badge>
                  </View>
                  <View style={styles.areaDetails}>
                    <Text variant="bodyMedium">
                      Loại phòng: {room.roomType}
                    </Text>
                    <Text variant="bodyMedium" style={styles.areaDescription}>
                      {room.description || 'Không có mô tả'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text variant="bodyLarge" style={styles.emptyText}>
                Không có phòng nào
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
