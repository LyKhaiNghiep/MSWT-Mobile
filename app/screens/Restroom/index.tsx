import {useNavigation} from '@react-navigation/native';
import React, {useState, useMemo} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Card,
  Text,
  Surface,
  IconButton,
  Menu,
  Button,
  Provider,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Restroom} from '../../config/models/restroom.model';
import {useRestrooms, getRestroomStatusColor} from '../../hooks/useRestroom';
import {useFloors} from '../../hooks/useFloor';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

export default function RestroomPage() {
  const {restrooms, isLoading} = useRestrooms();
  const {floors} = useFloors();
  const navigation = useNavigation<StackNavigation>();
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Extract floor number from restroom number (first digit)
  const getFloorFromRestroomNumber = (restroomNumber: string): number => {
    if (restroomNumber.length >= 1) {
      return parseInt(restroomNumber.charAt(0), 10);
    }
    return 0;
  };

  // Get floor name based on floor number
  const getFloorName = (floorNumber: number): string => {
    if (floorNumber === 0) return 'Tầng trệt';
    return `Tầng ${floorNumber}`;
  };

  // Filter restrooms based on selected floor
  const filteredRestrooms = useMemo(() => {
    if (selectedFloor === null) return restrooms || [];

    return (restrooms || []).filter(restroom => {
      const floorNumber = getFloorFromRestroomNumber(restroom.restroomNumber);
      return floorNumber === selectedFloor;
    });
  }, [restrooms, selectedFloor]);

  // Create floor options for dropdown - get floors from API
  const floorOptions = useMemo(() => {
    const sortedFloors = (floors || []).sort(
      (a, b) => a.floorNumber - b.floorNumber,
    );

    return [
      {label: 'Tất cả tầng', value: null},
      ...sortedFloors.map(floor => ({
        label: getFloorName(floor.floorNumber),
        value: floor.floorNumber,
      })),
    ];
  }, [floors]);

  const getSelectedFloorLabel = () => {
    if (selectedFloor === null) return 'Tất cả tầng';
    return getFloorName(selectedFloor);
  };

  const renderItem = ({item}: {item: Restroom}) => (
    <Surface style={styles.surface} elevation={2}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('RestroomDetails' as any, {id: item.restroomId})
        }>
        <Card.Content style={styles.cardContent}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.title}>
                NVS{item.restroomNumber}
              </Text>
              <View
                style={[
                  styles.badge,
                  {backgroundColor: getRestroomStatusColor(item.status)},
                ]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text variant="bodyMedium" style={styles.value}>
                {item.description || 'Không có mô tả'}
              </Text>
            </View>
          </View>

          <IconButton
            icon="chevron-right"
            size={24}
            iconColor={colors.primary}
            style={styles.chevron}
          />
        </Card.Content>
      </Card>
    </Surface>
  );

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Nhà vệ sinh" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Provider>
      <Screen useDefault>
        <AppHeader title="Nhà vệ sinh" />
        <View style={styles.container}>
          {/* Floor Filter Dropdown */}
          <View style={styles.filterContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.filterButton}>
                  {getSelectedFloorLabel()}
                </Button>
              }>
              {floorOptions.map(option => (
                <Menu.Item
                  key={option.value?.toString() || 'all'}
                  onPress={() => {
                    setSelectedFloor(option.value);
                    setMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>
          </View>

          <FlatList
            data={filteredRestrooms}
            renderItem={renderItem}
            keyExtractor={item => item.restroomId}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.centerContent}>
                <Text variant="bodyLarge" style={styles.emptyText}>
                  {selectedFloor !== null
                    ? 'Tầng này hiện chưa có nhà vệ sinh'
                    : 'Không có nhà vệ sinh nào'}
                </Text>
              </View>
            }
            removeClippedSubviews={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Screen>
    </Provider>
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
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
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
  title: {
    color: colors.primary,
    fontWeight: '600',
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
