import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Card,
  SegmentedButtons,
  Text,
  IconButton,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Floor} from '../../config/models/floor.model';
import {useFloors} from '../../hooks/useFloor';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

export default function ReportPage() {
  const {floors, isLoading} = useFloors();
  const [selectedType, setSelectedType] = useState('incident');
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

  const renderItem = ({item}: {item: Floor}) => (
    <Card
      style={[styles.card]}
      mode="elevated"
      onPress={() =>
        navigation.navigate('FloorDetails' as any, {id: item.floorId})
      }>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <View style={styles.floorNumberContainer}>
            <Text style={styles.floorNumber}>{item.floorNumber}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.title}>Tầng {item.floorNumber}</Text>
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
        <AppHeader title="Tầng" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Tầng" />
      <View style={styles.container}>
        <FlatList
          data={floors}
          renderItem={renderItem}
          keyExtractor={item => item.floorId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text>Không có tầng nào</Text>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorNumber: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
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
