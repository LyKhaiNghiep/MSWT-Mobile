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
import {Sensor} from '../../config/models/sensor.model';
import {useAreas} from '../../hooks/useArea';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';
import {Area} from '../../config/models/restroom.model';

export default function AreaPage() {
  const {areas, isLoading} = useAreas();
  const navigation = useNavigation<StackNavigation>();

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

  const renderItem = ({item}: {item: Area}) => (
    <Surface style={styles.surface} elevation={4}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('AreaDetails' as any, {id: item.areaId})
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
                    icon="map-marker-radius"
                    size={24}
                    iconColor={colors.primary}
                  />
                </View>
                <View style={styles.titleWrapper}>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.areaName}
                  </Text>
                  <Text variant="bodySmall" style={styles.subtitle}>
                    Số phòng: {item.roomBegin.trim()} - {item.roomEnd.trim()}
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
        <AppHeader title="Khu vực" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen useDefault>
      <AppHeader title="Khu vực" />
      <View style={styles.container}>
        <FlatList
          data={areas}
          renderItem={renderItem}
          keyExtractor={item => item.areaId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                Không có khu vực nào
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
