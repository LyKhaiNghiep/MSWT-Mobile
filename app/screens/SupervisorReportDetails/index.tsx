import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useRoute} from '@react-navigation/native';
import {
  Text,
  Card,
  Badge,
  ActivityIndicator,
  Surface,
  Divider,
  Avatar,
} from 'react-native-paper';
import {colors} from '../../theme';
import {format} from 'date-fns';
import {
  useReport,
  useReports,
  getReportStatusColor,
  getPriorityColor,
} from '../../hooks/useReport';

export default function SupervisorReportDetails() {
  const route = useRoute();

  const reportId = (route.params as any).reportId;
  const {report, isLoading, isError} = useReport(reportId);
  const {reports} = useReports();

  // Determine creator name with robust fallbacks (fullName -> userName)
  const reportFromList = reports.find(r => r.reportId === reportId);
  const creatorName =
    (report as any)?.fullName ||
    (report as any)?.userName ||
    (reportFromList as any)?.fullName ||
    (reportFromList as any)?.userName ||
    'Không rõ';

  // Debug log to check if workerName is available
  console.log('Report data:', report);
  console.log('Report from list:', reportFromList);
  console.log('Final workerName:', creatorName);

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: colors.grey}} useDefault>
        <AppHeader title="Chi tiết báo cáo" navigateTo="SupervisorReport" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (isError || !report) {
    return (
      <Screen styles={{backgroundColor: colors.grey}} useDefault>
        <AppHeader title="Chi tiết báo cáo" navigateTo="SupervisorReport" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải thông tin báo cáo</Text>
        </View>
      </Screen>
    );
  }

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

  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault>
      <AppHeader title="Chi tiết báo cáo" navigateTo="SupervisorReport" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Surface style={styles.headerCard} elevation={1}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.headerSection}>
                <View style={styles.headerLeft}>
                  <Avatar.Icon
                    size={56}
                    icon="file-document-outline"
                    style={[
                      styles.avatar,
                      {backgroundColor: colors.primary + '20'},
                    ]}
                  />
                  <View style={styles.headerInfo}>
                    <Text variant="headlineSmall" style={styles.reportName}>
                      {report.reportName}
                    </Text>
                    <Text variant="bodyMedium" style={styles.createdBy}>
                      Tạo bởi: {creatorName}
                    </Text>
                    <Text variant="bodySmall" style={styles.createdDate}>
                      {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm')}
                    </Text>
                  </View>
                </View>
                <View style={styles.headerRight}>
                  <Badge
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getReportStatusColor(report.status)},
                    ]}
                    size={24}>
                    {report.status}
                  </Badge>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Surface>

        {/* Report Image */}
        {report.image && (
          <Surface style={styles.imageCard} elevation={1}>
            <Card style={styles.card}>
              <Card.Content style={styles.imageContent}>
                <Image
                  source={{uri: report.image}}
                  style={styles.image}
                  resizeMode="cover"
                />
              </Card.Content>
            </Card>
          </Surface>
        )}

        {/* Details Card */}
        <Surface style={styles.detailsCard} elevation={1}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Thông tin chi tiết
              </Text>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.label}>
                    Loại báo cáo:
                  </Text>
                  <View style={styles.typeChip}>
                    <Text style={styles.typeText}>
                      {getReportTypeLabel(report.reportType)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.label}>
                    Mức độ ưu tiên:
                  </Text>
                  <View
                    style={[
                      styles.priorityChip,
                      {borderColor: getPriorityColor(report.priority)},
                    ]}>
                    <Text
                      style={[
                        styles.priorityText,
                        {color: getPriorityColor(report.priority)},
                      ]}>
                      {report.priority}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.label}>
                    Trạng thái:
                  </Text>
                  <Badge
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getReportStatusColor(report.status)},
                    ]}
                    size={24}>
                    {report.status}
                  </Badge>
                </View>

                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.label}>
                    Ngày tạo:
                  </Text>
                  <Text variant="bodyMedium" style={styles.value}>
                    {format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Text>
                </View>

                {report.resolvedAt && (
                  <View style={styles.detailItem}>
                    <Text variant="labelMedium" style={styles.label}>
                      Ngày giải quyết:
                    </Text>
                    <Text variant="bodyMedium" style={styles.value}>
                      {format(new Date(report.resolvedAt), 'dd/MM/yyyy HH:mm')}
                    </Text>
                  </View>
                )}
              </View>

              <Divider style={styles.divider} />

              <Text variant="labelMedium" style={styles.label}>
                Mô tả chi tiết:
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {report.description || 'Không có mô tả'}
              </Text>
            </Card.Content>
          </Card>
        </Surface>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.grey,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  headerCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  imageCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  detailsCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 0,
  },
  cardContent: {
    padding: 20,
  },
  imageContent: {
    padding: 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  reportName: {
    fontWeight: '700',
    marginBottom: 8,
    color: colors.darkLabel,
  },
  createdBy: {
    color: colors.primary,
    marginBottom: 4,
  },
  createdDate: {
    color: colors.subLabel,
  },
  workerId: {
    color: colors.subLabel,
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
    color: colors.darkLabel,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    color: colors.darkLabel,
    flex: 1,
  },
  value: {
    color: colors.darkLabel,
    textAlign: 'right',
    flex: 1,
  },
  typeChip: {
    height: 32,
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  priorityChip: {
    height: 32,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 20,
  },
  description: {
    color: colors.darkLabel,
    lineHeight: 22,
    marginTop: 8,
    backgroundColor: colors.grey,
    padding: 16,
    borderRadius: 12,
  },
});
