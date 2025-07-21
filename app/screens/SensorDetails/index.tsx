import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useSensor} from '../../hooks/useSensor';
import {colors} from '../../theme';

export default function SensorDetailsPage() {
  const route = useRoute();
  const {sensors} = useSensor();
  const id = (route.params as any).id;
  const trashbin = sensors?.find(r => r.sensorId === id);

  if (!trashbin) return null;

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết cảm biến" navigateTo="Sensor" />
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Tên cảm biến:</Text>
              <Text variant="bodyLarge">{trashbin.sensorName || 'N/A'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Trạng thái:</Text>
              <Text variant="bodyLarge">{trashbin.status}</Text>
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
