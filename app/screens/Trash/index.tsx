import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Card,
  Text,
  Surface,
  IconButton,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {TrashBin} from '../../config/models/trashbin.model';
import {useTrashBins} from '../../hooks/useTrashbin';
import {useAreas} from '../../hooks/useArea';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

export default function TrashBinPage() {
  const {trashbins, isLoading} = useTrashBins();
  const {areas} = useAreas();
  const navigation = useNavigation<StackNavigation>();

  // Helper function to get area name from areaId
  const getAreaName = (areaId: string): string => {
    const area = areas.find(a => a.areaId === areaId);
    return area?.areaName || `Khu vực ${areaId.slice(-4)}`;
  };
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

  const renderItem = ({item}: {item: TrashBin}) => (
    <Surface style={styles.surface} elevation={2}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('TrashDetails' as any, {id: item.trashBinId})
        }>
        <Card.Content style={styles.cardContent}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <View style={styles.textContainer}>
                  <Text
                    variant="titleMedium"
                    style={styles.title}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Thùng rác {item.trashBinId.slice(-4)}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={styles.subtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {getAreaName(item.areaId)}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.badge,
                  {backgroundColor: getStatusColor(item.status)},
                ]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
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
        <AppHeader title="Thùng rác" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen useDefault>
      <AppHeader title="Thùng rác" />
      <View style={styles.container}>
        <FlatList
          data={trashbins}
          renderItem={renderItem}
          keyExtractor={item => item.trashBinId}
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
  mainContent: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    color: colors.primary,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.subLabel,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: 24,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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
