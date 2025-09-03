import moment from 'moment';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {
  Provider,
  Text,
  Surface,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import ScheduleList from '../../components/Calendar/ScheduleList';
import {useAuth} from '../../contexts/AuthContext';
import {useScheduleDates} from '../../hooks/useScheduleDates';
import {useScheduleDetailsByDate} from '../../hooks/useScheduleDetailsByDate';
import {colors} from '../../theme';

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

export default function MyCalendar() {
  const {user} = useAuth();

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  // Use the optimized APIs
  const {
    dates,
    isLoading: datesLoading,
    error: datesError,
  } = useScheduleDates(user?.userId);
  const {
    scheduleDetails,
    isRefreshing,
    error: detailsError,
    mutate,
  } = useScheduleDetailsByDate(user?.userId, selectedDate);

  // Show error state (only for real errors, not "no data found")
  if (
    (datesError && !datesError.message?.includes('No scheduleDetails found')) ||
    (detailsError &&
      !detailsError.message?.includes('No scheduleDetails found'))
  ) {
    const errorMessage = datesError || detailsError;
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <Provider>
          <AppHeader title="Lịch làm việc" />
          <View style={styles.centerContent}>
            <Surface style={styles.errorContainer} elevation={1}>
              <IconButton
                icon="alert-circle"
                size={48}
                iconColor={colors.error}
              />
              <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
              <Text style={styles.errorText}>
                {errorMessage instanceof Error
                  ? errorMessage.message
                  : String(errorMessage)}
              </Text>
            </Surface>
          </View>
        </Provider>
      </Screen>
    );
  }

  const markedDates = dates.reduce((acc: any, date: string) => {
    return {
      ...acc,
      [date]: {
        marked: true,
        dotColor: '#FF4B2B',
      },
    };
  }, {});

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <Provider>
        <AppHeader title="Lịch làm việc" />
        <View style={styles.container}>
          {/* Loading indicator at the top */}
          {datesLoading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Đang tải lịch làm việc...</Text>
            </View>
          )}
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
              {dates.length === 0 && !datesLoading && !datesError ? (
                <Surface style={styles.emptyContainer} elevation={1}>
                  <IconButton
                    icon="calendar-blank"
                    size={64}
                    iconColor={colors.subLabel}
                  />
                  <Text style={styles.emptyTitle}>Không có lịch làm việc</Text>
                  <Text style={styles.emptySubtitle}>
                    Bạn chưa có lịch làm việc nào được phân công
                  </Text>
                </Surface>
              ) : (
                <ScheduleList
                  scheduleDetails={scheduleDetails}
                  onUpdate={() => mutate()}
                  isRefreshing={isRefreshing}
                  showRating={true}
                />
              )}
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
  loadingContainer: {
    padding: 24,
    margin: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary2,
    borderRadius: 8,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 24,
    margin: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.subLabel,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  emptyContainer: {
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
  container: {
    flex: 1,
    padding: 16,
  },
});
