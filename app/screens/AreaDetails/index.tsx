import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Badge, Card, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useSensor} from '../../hooks/useSensor';
import {colors} from '../../theme';
import {useAreas} from '../../hooks/useArea';

export default function AreaDetailsPage() {
  const route = useRoute();
  const {areas} = useAreas();
  const id = (route.params as any).id;
  const trashbin = areas?.find(r => r.areaId === id);

  if (!trashbin) return null;
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
      <AppHeader title="Chi tiết khu vực" navigateTo="Area" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Tên khu vực:</Text>
              <Text variant="bodyLarge">{trashbin.areaName || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Phòng bắt đầu:</Text>
              <Text variant="bodyLarge">{trashbin.roomBegin.trim()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Phòng kết thúc:</Text>
              <Text variant="bodyLarge">{trashbin.roomEnd.trim()}</Text>
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
                  },
                  {backgroundColor: getStatusColor(trashbin.status)},
                ]}>
                {trashbin.status}
              </Badge>
            </View>
            <View>
              <Text variant="labelLarge">Mô tả:</Text>
              <Text variant="bodyLarge">{trashbin.description}</Text>
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
