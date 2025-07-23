import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Badge,
  Card,
  SegmentedButtons,
  Text,
  IconButton,
  Surface,
  Avatar,
  Divider,
  Button,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {
  Report,
  useReports,
  getReportStatusColor,
  getPriorityColor,
} from '../../hooks/useReport';
import {StackNavigation} from '../../navigators';
import {colors} from '../../theme';

const REPORT_TYPES = [
  {value: 'incident', label: 'Báo cáo sự cố'},
  {value: 'staff', label: 'Báo cáo nhân viên'},
];

export default function ReportPage() {
  const {reports, isLoading, isError} = useReports();
  const [selectedType, setSelectedType] = useState('incident');
  const navigation = useNavigation<StackNavigation>();

  const filteredReports =
    reports?.filter(report =>
      selectedType === 'incident'
        ? report.reportType === 'Báo cáo sự cố'
        : report.reportType === 'Báo cáo nhân viên',
    ) || [];

  const renderItem = ({item}: {item: Report}) => (
    <Surface style={styles.surfaceContainer} elevation={1}>
      <Card
        style={styles.card}
        mode="elevated"
        onPress={() =>
          navigation.navigate('ReportDetails' as any, {reportId: item.reportId})
        }>
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
                  Bởi: {item.userName}
                </Text>
                <Text variant="bodySmall" style={styles.createdDate}>
                  {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Badge
                style={[
                  styles.statusBadge,
                  {backgroundColor: getReportStatusColor(item.status)},
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
                  {item.priority}
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
              <Text style={styles.typeText}>{item.reportType}</Text>
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
      <View>
        <Screen styles={{backgroundColor: colors.grey}} useDefault>
          <AppHeader title="Báo cáo" />
          <View style={[styles.container, styles.centerContent]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </Screen>
      </View>
    );
  }

  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault>
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
    backgroundColor: colors.grey,
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
  separator: {
    height: 12,
  },
  surfaceContainer: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 0,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  reportName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  createdBy: {
    color: colors.primary,
    marginBottom: 2,
  },
  createdDate: {
    color: colors.subLabel,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityChip: {
    height: 28,
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
    marginVertical: 12,
  },
  description: {
    color: colors.darkLabel,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  chevronIcon: {
    margin: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.subLabel,
    fontSize: 16,
    textAlign: 'center',
  },
});
