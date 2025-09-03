import React, {useState, useEffect} from 'react';
import {View, FlatList, Alert} from 'react-native';
import {
  Text,
  Card,
  Surface,
  SegmentedButtons,
  ActivityIndicator,
  IconButton,
  Avatar,
  Badge,
  Divider,
  Button,
} from 'react-native-paper';
import {format} from 'date-fns';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {colors} from '../../theme';
import {styles} from './styles';
import {ReportWithRole, useMyReportHistory} from '../../hooks/useReport';
import {BASE_API_URL} from '../../constants/api-urls';
import {useAuth} from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../navigators';

const REPORT_TYPES = [
  {value: '1', label: 'Báo cáo sự cố'},
  {value: '2', label: 'Báo cáo nhân viên'},
];

const PRIORITY_OPTIONS = [
  {value: 1, label: 'Thấp', color: colors.success},
  {value: 2, label: 'Trung bình', color: colors.yellow},
  {value: 3, label: 'Cao', color: colors.error},
];

export default function SupervisorReportPage() {
  const {reports, isLoading, refresh} = useMyReportHistory();
  const navigation = useNavigation<StackNavigation>();
  const {user} = useAuth();
  const [selectedTab, setSelectedTab] = useState('sent');

  const filteredReports = reports.filter((report: ReportWithRole) => {
    if (selectedTab === 'sent') {
      return report.status === 'Đã gửi';
    } else if (selectedTab === 'processed') {
      return report.status === 'Đã xử lý';
    }
    return true;
  });

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = (reportId: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa báo cáo này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            // Sử dụng API chung để xóa
            const response = await fetch(
              `${BASE_API_URL}/reports/${reportId}`,
              {
                method: 'DELETE',
              },
            );

            if (response.ok) {
              Alert.alert('Thành công', 'Báo cáo đã được xóa');
              refresh();
            } else {
              throw new Error('Không thể xóa báo cáo');
            }
          } catch (error) {
            Alert.alert(
              'Lỗi',
              error instanceof Error ? error.message : 'Có lỗi xảy ra',
            );
          }
        },
      },
    ]);
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

  const getPriorityLabel = (priority: string) => {
    return priority || 'Không xác định';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã gửi':
        return colors.blueDark;
      case 'Đang xử lý':
        return colors.warning;
      case 'Đã xử lý':
        return colors.success;
      case 'Đã đóng':
        return colors.subLabel;
      default:
        return colors.error;
    }
  };

  const getReportTypeLabel = (reportType: string) => {
    switch (reportType) {
      case '1':
        return 'Báo cáo sự cố';
      case '2':
        return 'Báo cáo nhân viên';
      default:
        return reportType || 'Không xác định';
    }
  };

  const renderItem = ({item}: {item: ReportWithRole}) => (
    <Surface style={styles.surfaceContainer} elevation={1}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() => {
          navigation.navigate('SupervisorReportDetails', {
            reportId: item.reportId,
          });
        }}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Avatar.Icon
                size={48}
                icon="file-document-outline"
                style={[
                  styles.avatar,
                  {backgroundColor: colors.primary + '20'},
                ]}
              />
              <View style={styles.headerInfo}>
                <Text
                  variant="titleMedium"
                  style={styles.reportName}
                  numberOfLines={1}>
                  {item.reportName}
                </Text>
                <Text variant="bodySmall" style={styles.createdBy}>
                  Bởi:{' '}
                  {item.fullName || item.userName || user?.fullName || 'N/A'}
                </Text>
                <Text variant="bodySmall" style={styles.createdDate}>
                  {item.date
                    ? format(new Date(item.date), 'dd/MM/yyyy HH:mm')
                    : item.createdAt
                    ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')
                    : 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Badge
                style={[
                  styles.statusBadge,
                  {backgroundColor: getStatusColor(item.status)},
                ]}
                size={24}>
                {item.status}
              </Badge>
              <View
                style={[
                  styles.priorityChip,
                  {borderColor: getPriorityColor(item.priority)},
                ]}>
                <Text
                  style={[
                    styles.priorityText,
                    {color: getPriorityColor(item.priority)},
                  ]}>
                  {getPriorityLabel(item.priority)}
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text
            variant="bodyMedium"
            style={styles.description}
            numberOfLines={2}>
            {item.description || 'Không có mô tả'}
          </Text>

          <View style={styles.footer}>
            <View style={styles.typeChip}>
              <Text style={styles.typeText}>
                {getReportTypeLabel(item.reportType)}
              </Text>
            </View>
            <IconButton
              icon="chevron-right"
              size={20}
              iconColor={colors.primary}
              style={styles.chevronIcon}
            />
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: colors.grey}} useDefault>
        <AppHeader title="Báo cáo Supervisor" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault>
      <AppHeader title="Báo cáo Supervisor" />
      <View style={styles.container}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            {
              value: 'sent',
              label: 'Đã gửi',
              icon: 'send',
            },
            {
              value: 'processed',
              label: 'Đã xử lý',
              icon: 'check-circle',
            },
          ]}
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
              <Text style={styles.emptyText}>
                {selectedTab === 'sent'
                  ? 'Không có báo cáo đã gửi'
                  : 'Không có báo cáo đã xử lý'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('CreateSupervisorReport')}>
          Tạo báo cáo
        </Button>
      </View>
    </Screen>
  );
}
