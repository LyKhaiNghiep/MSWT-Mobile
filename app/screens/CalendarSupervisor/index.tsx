import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {
  Text,
  Card,
  Surface,
  ActivityIndicator,
  Chip,
  Divider,
  Avatar,
  Badge,
} from 'react-native-paper';
import {colors} from '../../theme';
import {format, parseISO, isToday, isTomorrow, isYesterday} from 'date-fns';
import {vi} from 'date-fns/locale';
import {useScheduleDetails} from '../../hooks/useScheduleDetails';
import {useAuth} from '../../contexts/AuthContext';

export default function CalendarSupervisor() {
  const {user} = useAuth();
  const userId = user?.userId; // Lấy userId từ user đã đăng nhập
  const {scheduleDetails, isLoading, error} = useScheduleDetails(userId);

  // Debug logging
  console.log('🔍 CalendarSupervisor - user:', user);
  console.log('🔍 CalendarSupervisor - userId:', userId);
  console.log('🔍 CalendarSupervisor - scheduleDetails length:', scheduleDetails?.length);

  // Group schedule details by date
  const groupByDate = (schedules: any[]) => {
    const grouped: {[key: string]: any[]} = {};
    schedules.forEach(schedule => {
      const date = format(parseISO(schedule.date), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupByDate(scheduleDetails);

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Hôm nay';
    if (isTomorrow(date)) return 'Ngày mai';
    if (isYesterday(date)) return 'Hôm qua';
    return format(date, 'EEEE, dd/MM/yyyy', {locale: vi});
  };

  const getTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'hoạt động':
        return colors.success;
      case 'pending':
      case 'chờ':
        return colors.warning;
      case 'completed':
      case 'hoàn thành':
        return colors.primary;
      default:
        return colors.grey;
    }
  };

  const getScheduleTypeColor = (scheduleType: string) => {
    switch (scheduleType?.toLowerCase()) {
      case 'cleaning':
        return colors.primary;
      case 'maintenance':
        return colors.secondary1;
      case 'inspection':
        return colors.success;
      default:
        return colors.grey;
    }
  };

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: colors.white}} useDefault>
        <AppHeader title="Lịch làm việc Supervisor" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải lịch làm việc...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen styles={{backgroundColor: colors.white}} useDefault>
        <AppHeader title="Lịch làm việc Supervisor" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Không thể tải lịch làm việc. Vui lòng thử lại.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: colors.white}} useDefault>
      <AppHeader title="Lịch làm việc Supervisor" />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {scheduleDetails.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Avatar.Icon 
              size={80} 
              icon="calendar-blank" 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Không có lịch làm việc</Text>
            <Text style={styles.emptySubtitle}>
              Hiện tại không có lịch làm việc nào được lên kế hoạch.
            </Text>
          </View>
        ) : (
          Object.entries(groupedSchedules).map(([date, schedules]) => (
            <Surface key={date} style={styles.dateSection} elevation={2}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateLabel}>{getDateLabel(date)}</Text>
                <Badge style={styles.scheduleCount}>
                  {`${schedules.length} lịch`}
                </Badge>
              </View>
              
              {schedules.map((schedule, index) => (
                <Card key={schedule.scheduleDetailId} style={styles.scheduleCard}>
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.scheduleHeader}>
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                          {getTimeRange(schedule.startTime, schedule.endTime)}
                        </Text>
                        <Chip 
                          style={[
                            styles.typeChip,
                            {backgroundColor: getScheduleTypeColor(schedule.schedule.scheduleType)}
                          ]}
                          textStyle={styles.typeChipText}
                        >
                          {schedule.schedule.scheduleType}
                        </Chip>
                      </View>
                      
                      <Chip 
                        style={[
                          styles.statusChip,
                          {backgroundColor: getStatusColor(schedule.status)}
                        ]}
                        textStyle={styles.statusChipText}
                      >
                        {schedule.status}
                      </Chip>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.scheduleInfo}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Công việc:</Text>
                        <Text style={styles.infoValue}>
                          {schedule.assignmentName}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Khu vực:</Text>
                        <Text style={styles.infoValue}>
                          {schedule.areaName}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nhà vệ sinh:</Text>
                        <Text style={styles.infoValue}>
                          {schedule.schedule.restroomNumber}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mô tả:</Text>
                        <Text style={styles.infoValue}>
                          {schedule.description}
                        </Text>
                      </View>

                      {schedule.schedule.trashBin && (
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Thùng rác:</Text>
                          <Text style={styles.infoValue}>
                            {schedule.schedule.trashBin.location}
                          </Text>
                        </View>
                      )}

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày:</Text>
                        <Text style={styles.infoValue}>
                          {format(parseISO(schedule.date), 'dd/MM/yyyy')}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </Surface>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grey,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    backgroundColor: colors.grey,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  typeChip: {
    height: 24,
  },
  typeChipText: {
    fontSize: 12,
    color: colors.white,
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 12,
    color: colors.white,
  },
  divider: {
    marginVertical: 8,
  },
  scheduleInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
    textAlign: 'right',
  },
}); 