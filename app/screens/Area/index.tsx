import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Card, Text, IconButton} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Area} from '../../config/models/area.model';
import {useAreas} from '../../hooks/useArea';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

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
    <Card
      style={[styles.card]}
      mode="elevated"
      onPress={() =>
        navigation.navigate('FloorDetails' as any, {id: item.areaId})
      }>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <View style={styles.floorNumberContainer}>
            <Text style={styles.floorNumber}>{item.rooms?.length || 0}</Text>
            <Text style={styles.roomLabel}>phòng</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.title}>{item.areaName}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.status,
                {
                  backgroundColor: getStatusColor(item.status),
                  width: 100,
                  textAlign: 'center',
                  color: 'white',
                  borderRadius: 10,
                },
              ]}>
              {item.status}
            </Text>
          </View>
        </View>
        <IconButton
          icon="chevron-right"
          size={24}
          iconColor={colors.subLabel}
          style={styles.chevron}
        />
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Khu vực" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Khu vực" />
      <View style={styles.container}>
        <FlatList
          data={areas}
          renderItem={renderItem}
          keyExtractor={item => item.areaId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text>Không có khu vực nào</Text>
            </View>
          }
          removeClippedSubviews={false}
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
  segmentedButtons: {
    marginBottom: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 12,
    backgroundColor: colors.white,
    elevation: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftContent: {
    marginRight: 16,
  },
  floorNumberContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorNumber: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: -2,
  },
  roomLabel: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  rightContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkLabel,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.subLabel,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
  },
  chevron: {
    margin: 0,
  },
});
