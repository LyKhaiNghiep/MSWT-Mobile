import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Badge, Button, Card, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {TRequest, useRequest} from '../../hooks/useRequest';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

export default function Request() {
  const navigation = useNavigation<StackNavigation>();
  const {data: requests} = useRequest();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'đã xử lý':
        return '#4CAF50';
      case 'từ chối':
        return '#F44336';
      case 'đang chờ xử lý':
        return '#FFC107';
      default:
        return '#757575';
    }
  };

  const renderRequestItem = ({item}: {item: TRequest}) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('RequestDetails' as any, {id: item.requestId})
      }>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">Yêu cầu </Text>
          <Badge
            style={[
              styles.badge,
              {backgroundColor: getStatusColor(item.status)},
            ]}>
            {item.status}
          </Badge>
        </View>
        <Text variant="bodyMedium">
          Ngày yêu cầu: {format(new Date(item.requestDate), 'dd/MM/yyyy')}
        </Text>
        {item.location && (
          <Text variant="bodyMedium">Vị trí: {item.location}</Text>
        )}
        <Text variant="bodyMedium" numberOfLines={2}>
          Mô tả: {item.description}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Danh sách yêu cầu" />
      <View style={styles.container}>
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.requestId}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có yêu cầu nào</Text>
          }
          removeClippedSubviews={false}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('CreateRequest')}>
          Tạo yêu cầu mới
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.mainColor,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: colors.subLabel,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'center',
  },
});
