import {format, parseISO} from 'date-fns';
import moment from 'moment';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  IconButton,
  ProgressBar,
  Surface,
  Text,
} from 'react-native-paper';
import {ScheduleDetails} from '../../config/models/scheduleDetails.model';
import {useAuth} from '../../contexts/AuthContext';
import {useSchedules} from '../../hooks/useSchedule';
import {colors} from '../../theme';
import ScheduleList from './ScheduleList';

export default function UpcomingCalendar() {
  const {user} = useAuth();
  const userId = user?.userId;
  const {schedules, isLoading, error, mutate} = useSchedules(userId);
  const scheduleDetails = schedules
    .filter(x => {
      const isUpcoming = x.date >= moment().format('YYYY-MM-DD');
      const lowerStatus = x.status?.toLowerCase().trim();
      const isUpcomingStatus =
        lowerStatus === 'sắp tới' || lowerStatus === 'sap toi';
      return isUpcoming && isUpcomingStatus;
    })
    .sort((a, b) => moment(a.date).diff(moment(b.date))); // Sort by date ascending (closest first)

  const groupByDate = (scheduleList: ScheduleDetails[]) => {
    const grouped: {[key: string]: any[]} = {};
    scheduleList.forEach(schedule => {
      const date = format(parseISO(schedule.date), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });

    // Sort schedules within each date by start time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const timeA = moment(a.startTime, 'HH:mm:ss');
        const timeB = moment(b.startTime, 'HH:mm:ss');
        return timeA.diff(timeB);
      });
    });

    return grouped;
  };

  const groupedSchedulesObject = groupByDate(scheduleDetails);

  // Convert object to array format for easier rendering and sort by date
  const groupedSchedules = Object.entries(groupedSchedulesObject)
    .map(([date, scheduleList]) => ({
      date,
      schedules: scheduleList,
    }))
    .sort((a, b) => moment(a.date).diff(moment(b.date))); // Sort groups by date ascending

  if (isLoading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Đang tải lịch làm việc...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Không thể tải lịch làm việc. Vui lòng thử lại.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {isLoading && (
        <Surface style={styles.loadingContainer} elevation={1}>
          <ProgressBar indeterminate color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải lịch làm việc...</Text>
        </Surface>
      )}

      {error && (
        <Surface style={styles.errorContainer} elevation={1}>
          <IconButton icon="alert-circle" size={48} iconColor={colors.error} />
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="outlined">Thử lại</Button>
        </Surface>
      )}

      {!isLoading && !error && groupedSchedules.length === 0 && (
        <Surface style={styles.emptyContainer} elevation={1}>
          <IconButton
            icon="calendar-check"
            size={64}
            iconColor={colors.subLabel}
          />
          <Text style={styles.emptyTitle}>Không có lịch sắp tới</Text>
        </Surface>
      )}

      {!isLoading && !error && (
        <ScheduleList scheduleDetails={scheduleDetails} onUpdate={mutate} />
      )}
    </ScrollView>
  );
}

// Enhanced styles with modern design principles
const styles = StyleSheet.create({
  modernScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modernDateSection: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  modernDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.secondary2,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  dateSubtitle: {
    fontSize: 14,
    color: colors.subLabel,
  },
  progressContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  modernScheduleCard: {
    margin: 1,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: colors.white,
  },
  modernCardContent: {
    padding: 16,
  },
  scheduleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  modernChipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modernTypeChip: {},
  modernChipText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  modernDivider: {
    backgroundColor: colors.line,
    marginVertical: 16,
  },
  modernInfoContainer: {
    gap: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey,
    padding: 12,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.subLabel,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary2,
    padding: 12,
    borderRadius: 8,
  },
  workerAvatar: {
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingContainer: {
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 8,
  },
  modernDialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    color: colors.primary,
    fontWeight: '700',
  },
  modernRatingContainer: {
    gap: 20,
  },
  ratingSection: {
    backgroundColor: colors.grey,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  modernCommentInput: {
    backgroundColor: colors.white,
  },
  dialogActions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cancelButton: {
    borderColor: colors.inputStroke,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.subLabel,
  },
  errorContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.subLabel,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 32,
    margin: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subLabel,
    textAlign: 'center',
    lineHeight: 20,
  },
  dateSection: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.secondary2,
  },
  dateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    margin: 0,
    marginRight: 8,
  },

  scheduleCount: {
    backgroundColor: colors.primary,
  },
  scheduleCard: {
    margin: 8,
    marginBottom: 8,
    elevation: 1,
  },
  cardContent: {
    padding: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typeChip: {
    minWidth: 100,
    height: 28,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    color: colors.white,
    fontSize: 12,
  },
  divider: {
    marginVertical: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  workerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary2,
    padding: 8,
    borderRadius: 8,
  },

  ratingText: {
    color: colors.warning,
    marginLeft: 4,
  },

  commentInput: {
    width: '100%',
    marginTop: 16,
  },
});
