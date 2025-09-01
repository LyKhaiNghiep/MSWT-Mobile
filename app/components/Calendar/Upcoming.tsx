import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Surface, Text, IconButton} from 'react-native-paper';
import {format, parseISO} from 'date-fns';
import moment from 'moment';
import {ScheduleDetails} from '../../config/models/scheduleDetails.model';
import {colors} from '../../theme';
import SupervisorScheduleList from './SupervisorScheduleList';

interface UpcomingCalendarProps {
  scheduleDetails?: ScheduleDetails[];
  onUpdate?: () => void;
}

export default function UpcomingCalendar({scheduleDetails = [], onUpdate}: UpcomingCalendarProps) {
  // Filter upcoming schedules (from today onwards)
  const upcomingSchedules = scheduleDetails.filter(schedule => {
    const scheduleDate = moment(schedule.date);
    const today = moment().startOf('day');
    return scheduleDate.isSameOrAfter(today);
  });

  if (upcomingSchedules.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Surface style={styles.emptyCard} elevation={1}>
          <IconButton
            icon="calendar-blank"
            size={64}
            iconColor={colors.subLabel}
          />
          <Text style={styles.emptyTitle}>Không có lịch sắp tới</Text>
          <Text style={styles.emptySubtitle}>
            Bạn chưa có lịch làm việc nào sắp tới
          </Text>
        </Surface>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SupervisorScheduleList 
        scheduleDetails={upcomingSchedules} 
        onUpdate={onUpdate} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCard: {
    padding: 32,
    margin: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
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
});
