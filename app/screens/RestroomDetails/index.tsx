import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text, ActivityIndicator} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useRestroom, getRestroomStatusColor} from '../../hooks/useRestroom';
import {colors} from '../../theme';

export default function RestroomDetails() {
  const route = useRoute();
  const restroomId = (route.params as any).id;
  const {restroom, isLoading, isError} = useRestroom(restroomId);

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: colors.grey}} useDefault>
        <AppHeader title="Chi tiết nhà vệ sinh" navigateTo="Restroom" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (isError || !restroom) {
    return (
      <Screen styles={{backgroundColor: colors.grey}} useDefault>
        <AppHeader title="Chi tiết nhà vệ sinh" navigateTo="Restroom" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Không thể tải thông tin nhà vệ sinh
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault>
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
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: getRestroomStatusColor(restroom.status),
                  },
                ]}>
                <Text style={styles.badgeText}>{restroom.status}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Khu vực:</Text>
              <Text variant="bodyLarge">
                {restroom.areaName || 'Không có thông tin'}
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
    backgroundColor: colors.grey,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary1Light,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  description: {
    marginTop: 16,
  },
  descriptionText: {
    marginTop: 8,
    color: colors.darkLabel,
    backgroundColor: colors.grey,
    padding: 16,
    borderRadius: 12,
  },
});
