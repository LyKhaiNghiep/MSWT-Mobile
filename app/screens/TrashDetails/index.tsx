import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useTrashBins} from '../../hooks/useTrashbin';
import {colors} from '../../theme';
import {format} from 'date-fns';

export default function TrashBinDetails() {
  const route = useRoute();
  const {trashbins} = useTrashBins();
  const id = (route.params as any).id;
  const trashbin = trashbins?.find(r => r.trashBinId === id);
  console.log('trashbin', trashbin);
  if (!trashbin) return null;

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
              <Text variant="bodyLarge">{trashbin.areaName || 'N/A'}</Text>
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
