import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Badge,
  Button,
  Card,
  IconButton,
  Surface,
  Text,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Report, useReports, useWorkerReports} from '../../hooks/useReport';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';
import {useAuth} from '../../contexts/AuthContext';
import {isEmpty} from '../../utils';

export default function WorkerReportPage() {
  const {reports, isLoading, isError} = useWorkerReports();
  const navigation = useNavigation<StackNavigation>();
  const {user} = useAuth();
  const filteredReports = reports || [];





  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã gửi':
        return colors.success;
      case 'Đang xử lý':
        return colors.warning;
      default:
        return colors.error;
    }
  };

  const renderItem = ({item}: {item: Report}) => (
    <Surface style={styles.surfaceContainer} elevation={2}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('WorkerReportDetails' as any, {
            reportId: item.reportId,
          })
        }>
        <View style={styles.cardHeader}>
          <View style={styles.imageContainer}>
            {isEmpty(item.image) && (
              <Image style={styles.image} source={{uri: item.image ?? ''}} />
            )}
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.description} numberOfLines={2}>
              {item.reportName || 'Không có mô tả'}
            </Text>
            <Text style={styles.date}>
              {item.createdAt
                ? format(new Date(item.createdAt), 'dd/MM/yyyy')
                : 'N/A'}
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
        <Card.Content style={styles.cardContent}>
          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'Không có mô tả'}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.type}>{item.reportType}</Text>
            <IconButton
              icon="chevron-right"
              size={20}
              iconColor={colors.subLabel}
            />
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: colors.white}} useDefault>
        <AppHeader title="Báo cáo" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen styles={{backgroundColor: colors.white}} useDefault>
        <AppHeader title="Báo cáo" />
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>Đã xảy ra lỗi khi tải dữ liệu</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: colors.white}} useDefault>
      <AppHeader title="Báo cáo" />
      <View style={styles.container}>
        <FlatList
          data={filteredReports}
          renderItem={renderItem}
          keyExtractor={item => item.reportId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>Không có báo cáo nào</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('CreateReport')}>
          Tạo báo cáo
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    backgroundColor: colors.mainColor,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
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
    paddingBottom: 16,
  },
  surfaceContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary1Light,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.subLabel,
  },
  badge: {
    borderRadius: 4,
  },
  cardContent: {
    paddingTop: 8,
  },
  description: {
    fontSize: 14,
    color: colors.darkLabel,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  type: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
  emptyText: {
    color: colors.subLabel,
    fontSize: 16,
  },
});