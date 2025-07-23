import React from 'react';
import {FlatList, StyleSheet, View, TouchableOpacity} from 'react-native';
import {ActivityIndicator, Badge, Card, IconButton, Surface, Text, SegmentedButtons, Avatar, Divider} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useReports} from '../../hooks/useReport';
import {useAuth} from '../../contexts/AuthContext';
import {colors} from '../../theme';
import {format} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../navigators';

export default function WorkerReportPage() {
  const {reports, isLoading, isError, refresh} = useReports();
  const navigation = useNavigation<StackNavigation>();
  const {user} = useAuth();
  const [selectedType, setSelectedType] = React.useState('incident');

  React.useEffect(() => { refresh(); }, []);

  // Lọc theo loại báo cáo
  const filteredReports =
    reports?.filter(report =>
      selectedType === 'incident'
        ? report.reportType === 'Báo cáo sự cố'
        : report.reportType === 'Báo cáo nhân viên',
    ) || [];

  const REPORT_TYPES = [
    {value: 'incident', label: 'Báo cáo sự cố'},
    {value: 'staff', label: 'Báo cáo nhân viên'},
  ];

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Thấp':
        return colors.success;
      case 'Trung bình':
      case 'Trung Bình':
        return colors.yellow;
      case 'Cao':
        return colors.error;
      default:
        return colors.subLabel;
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => navigation.navigate('WorkerReportDetails' as any, { reportId: item.reportId } as any)} activeOpacity={0.8}>
      <Surface style={styles.surfaceContainer} elevation={2}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Avatar.Icon size={40} icon="file-document-outline" style={styles.avatar} />
              <View style={styles.headerInfo}>
                <Text variant="titleMedium" style={styles.reportName} numberOfLines={1}>{item.reportName}</Text>
                <Text variant="bodySmall" style={styles.createdBy}>Bởi: {item.userName}</Text>
                <Text variant="bodySmall" style={styles.createdDate}>{item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</Text>
              </View>
              <View style={styles.statusPriorityWrap}>
                <Badge style={[styles.statusBadge, {borderColor: getStatusColor(item.status), color: getStatusColor(item.status)}]} size={18}>{item.status}</Badge>
                <View style={[styles.priorityChip, {borderColor: getPriorityColor(item.priority)}]}>
                  <Text style={[styles.priorityText, {color: getPriorityColor(item.priority)}]}>{item.priority}</Text>
                </View>
              </View>
            </View>
            <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>{item.description || 'Không có mô tả'}</Text>
            <View style={styles.footer}>
              <View style={styles.typeChip}>
                <Text style={styles.typeText}>{item.reportType}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Surface>
    </TouchableOpacity>
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
        <SegmentedButtons
          value={selectedType}
          onValueChange={setSelectedType}
          buttons={REPORT_TYPES}
          style={styles.segmentedButtons}
        />
        <FlatList
          data={filteredReports}
          renderItem={renderItem}
          keyExtractor={item => item.reportId}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: colors.white,
    elevation: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 0,
    shadowColor: 'rgba(0,0,0,0.08)',
  },
  cardContent: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 10, // tăng gap dưới header
  },
  avatar: {
    backgroundColor: colors.secondary1Light,
    marginRight: 14, // tăng gap avatar và info
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10, // tăng gap info
    marginBottom: 4, // tăng gap dưới info
  },
  reportName: {
    fontWeight: '900',
    color: colors.dark,
    fontSize: 17,
    marginBottom: 4,
  },
  createdBy: {
    color: colors.subLabel,
    fontSize: 11,
    marginBottom: 2, // tăng gap dưới by
  },
  createdDate: {
    color: colors.subLabel,
    fontSize: 11,
    marginBottom: 2, // tăng gap dưới date
  },
  statusPriorityWrap: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10, // tăng gap trái
  },
  statusBadge: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.white,
    color: colors.success,
    fontSize: 11,
    fontWeight: 'bold', // in đậm trạng thái
    paddingHorizontal: 8,
    paddingVertical: 0,
    minWidth: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  priorityChip: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 0,
    alignSelf: 'flex-end',
    minHeight: 18,
    minWidth: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // tăng gap dưới priority
  },
  priorityText: {
    fontSize: 11,
    fontWeight: 'bold', // in đậm priority
    textAlign: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  description: {
    fontSize: 13,
    color: colors.dark,
    marginBottom: 12, // tăng gap dưới mô tả
    paddingHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8, // tăng gap trên chip
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  typeChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4, // tăng padding chip
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    color: colors.dark,
    fontWeight: 'bold', // in đậm loại báo cáo
  },
  chevronIcon: {
    marginLeft: 8,
  },
  separator: {
    height: 12,
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