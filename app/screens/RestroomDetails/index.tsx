import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, Badge} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useRestrooms} from '../../hooks/useRestroom';
import {colors} from '../../theme';

export default function RestroomDetails() {
  const route = useRoute();
  const {restrooms} = useRestrooms();
  const id = (route.params as any).id;
  const restroom = restrooms?.find(r => r.restroomId === id);

  if (!restroom) return null;

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
      <AppHeader title="Chi tiết nhà vệ sinh" navigateTo="Restroom" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Mã nhà vệ sinh:</Text>
              <Text variant="bodyLarge">NVS{restroom.restroomNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Trạng thái:</Text>
              <Badge
                style={[
                  {
                    backgroundColor: getStatusColor(restroom.status),
                  },
                ]}>
                {restroom.status}
              </Badge>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Khu vực:</Text>
              <Text variant="bodyLarge">
                {restroom.area?.areaName || 'Không có'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Vị trí phòng:</Text>
              <Text variant="bodyLarge">
                {restroom.area
                  ? `${restroom.area.roomBegin} - ${restroom.area.roomEnd}`
                  : 'Không có'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Ngày tạo:</Text>
              <Text variant="bodyLarge">
                {restroom.createdAt
                  ? new Date(restroom.createdAt).toLocaleDateString('vi-VN')
                  : 'Không có'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Cập nhật lần cuối:</Text>
              <Text variant="bodyLarge">
                {restroom.updatedAt
                  ? new Date(restroom.updatedAt).toLocaleDateString('vi-VN')
                  : 'Không có'}
              </Text>
            </View>

            <View style={styles.description}>
              <Text variant="labelLarge">Mô tả:</Text>
              <Text variant="bodyLarge" style={styles.descriptionText}>
                {restroom.description || 'Không có mô tả'}
              </Text>
            </View>
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
});
