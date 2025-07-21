import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Badge,
  Card,
  IconButton,
  Surface,
  Text,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {TrashBin} from '../../config/models/trashbin.model';
import {useSensor} from '../../hooks/useSensor';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';
import {Sensor} from '../../config/models/sensor.model';

export default function SensorPage() {
  const {sensors, isLoading} = useSensor();
  const navigation = useNavigation<StackNavigation>();

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

  const renderItem = ({item}: {item: Sensor}) => (
    <Surface style={styles.surface} elevation={4}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('SensorDetails' as any, {id: item.sensorId})
        }>
        <Card.Content style={styles.cardContent}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: colors.primary + '10'},
                  ]}>
                  <IconButton
                    icon="signal-variant"
                    size={24}
                    iconColor={colors.primary}
                  />
                </View>
                <View style={styles.titleWrapper}>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.sensorName}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtitle}>
                    ID: {item.sensorId}
                  </Text>
                  <Badge
                    style={[
                      styles.badge,
                      {backgroundColor: getStatusColor(item.status)},
                    ]}>
                    {item.status}
                  </Badge>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Cảm biến" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen useDefault>
      <AppHeader title="Cảm biến" />
      <View style={styles.container}>
        <FlatList
          data={sensors}
          renderItem={renderItem}
          keyExtractor={item => item.sensorId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Không có thùng rác nào
              </Text>
            </View>
          }
          removeClippedSubviews={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  surface: {
    borderRadius: 12,
    backgroundColor: colors.white,
    marginHorizontal: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 2,
  },
  subtitle: {
    color: colors.subLabel,
  },
  mainContent: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  title: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  infoContainer: {
    marginTop: 4,
  },
  label: {
    color: colors.subLabel,
    marginBottom: 2,
  },
  value: {
    color: colors.darkLabel,
  },
  chevron: {
    margin: 0,
    padding: 0,
  },
  separator: {
    height: 12,
  },
  emptyText: {
    color: colors.subLabel,
    textAlign: 'center',
  },
});
