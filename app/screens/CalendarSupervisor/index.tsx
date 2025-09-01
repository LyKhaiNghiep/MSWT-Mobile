import {format, parseISO} from 'date-fns';
import moment from 'moment';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Provider, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {SupervisorScheduleList} from '../../components/Calendar';
import {useScheduleDates} from '../../hooks/useScheduleDates';
import {useScheduleDetailsByDate} from '../../hooks/useScheduleDetailsByDate';
import {colors} from '../../theme';
import {useAuth} from '../../contexts/AuthContext';

// Configure Vietnamese locale
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th1',
    'Th2',
    'Th3',
    'Th4',
    'Th5',
    'Th6',
    'Th7',
    'Th8',
    'Th9',
    'Th10',
    'Th11',
    'Th12',
  ],
  dayNames: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};

// Set default locale
LocaleConfig.defaultLocale = 'vi';

export default function CalendarSupervisor() {
  const {user} = useAuth();
  const userId = user?.userId;

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  // Use the optimized APIs like Worker Calendar
  const {
    dates,
    isLoading: datesLoading,
    error: datesError,
  } = useScheduleDates(userId);
  const {
    scheduleDetails,
    isRefreshing,
    error: detailsError,
    mutate,
  } = useScheduleDetailsByDate(userId, selectedDate);
  // Removed all tab-related state and filter options since we only have 'schedule' tab now

  // Show error state (only for real errors, not "no data found")
  if (
    (datesError && !datesError.message?.includes('No scheduleDetails found')) ||
    (detailsError &&
      !detailsError.message?.includes('No scheduleDetails found'))
  ) {
    const errorMessage = datesError || detailsError;
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Lịch làm việc " />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {errorMessage instanceof Error
              ? errorMessage.message
              : String(errorMessage)}
          </Text>
        </View>
      </Screen>
    );
  }

  // No filtering needed since we only have the calendar view

  // Use dates array for markedDates (like Worker Calendar)
  const markedDates = dates.reduce((acc: any, date: string) => {
    return {
      ...acc,
      [date]: {
        marked: true,
        dotColor: '#FF4B2B',
      },
    };
  }, {});

  if (datesLoading || isRefreshing) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Lịch làm việc " />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải lịch làm việc...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <Provider>
        <AppHeader title="Lịch làm việc " />
        <View style={styles.container}>
          <ScrollView>
            <Calendar
              current={selectedDate}
              onDayPress={(day: any) => {
                console.log('dateString', day.dateString);
                setSelectedDate(day.dateString);
              }}
              markedDates={{
                ...markedDates,

                [selectedDate]: {
                  selected: true,
                  marked: (markedDates as any)[selectedDate]?.marked!,
                  dotColor: (markedDates as any)[selectedDate]?.dotColor,
                },
              }}
              theme={{
                selectedDayBackgroundColor: '#FF4B2B',
                todayTextColor: '#FF4B2B',
                dotColor: '#FF4B2B',
                arrowColor: '#FF4B2B',
              }}
            />
            <View style={{marginTop: 10}}>
              <SupervisorScheduleList
                scheduleDetails={scheduleDetails.filter(
                  x =>
                    format(parseISO(x.date), 'yyyy-MM-dd') === selectedDate,
                )}
                onUpdate={mutate}
              />
            </View>
          </ScrollView>
        </View>
      </Provider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    marginTop: 26,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.subLabel,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  tabs: {
    marginBottom: 16,
  },
  statusFilter: {
    marginBottom: 16,
  },
  calendar: {
    height: 100,
    marginBottom: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: '#000',
    fontSize: 14,
  },
  dateNumber: {
    color: '#000',
    fontSize: 14,
  },
  dateName: {
    color: '#000',
    fontSize: 12,
  },
  highlightDateNumber: {
    color: '#fff',
    fontSize: 14,
  },
  highlightDateName: {
    color: '#fff',
    fontSize: 12,
  },
  disabledDateName: {
    color: '#ccc',
    fontSize: 12,
  },
  disabledDateNumber: {
    color: '#ccc',
    fontSize: 14,
  },
  iconContainer: {
    flex: 0.1,
  },
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  divider: {
    marginVertical: 12,
  },
  content: {
    gap: 4,
  },
  list: {
    paddingBottom: 16,
  },
  timeRangeButton: {
    marginBottom: 16,
    width: '100%',
    minWidth: 170,
    alignSelf: 'stretch',
  },
  calendarPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey,
    borderRadius: 8,
    marginBottom: 16,
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
}); 