import {format, parseISO} from 'date-fns';
import moment from 'moment';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Button, Menu, Provider, SegmentedButtons} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import ScheduleList from '../../components/Calendar/ScheduleList';
import UpcomingCalendar from '../../components/Calendar/Upcoming';
import {useAuth} from '../../contexts/AuthContext';
import {useSchedules} from '../../hooks/useSchedule';
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
  const {schedules} = useSchedules(user?.userId);

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [menuStatusVisible, setMenuStatusVisible] = useState(false);
  const [status, setStatus] = useState('Chưa hoàn thành');

  const [selectedMonth, setSelectedMonth] = useState<string | number>('all'); // Default to 'all'
  const [selectedYear, setSelectedYear] = useState<string | number>('all'); // Default to 'all'
  const [monthMenuVisible, setMonthMenuVisible] = useState(false);
  const [yearMenuVisible, setYearMenuVisible] = useState(false);

  const months: {label: string; value: string | number}[] = [
    {label: 'Chọn tháng', value: 'all'},
    {label: 'Tháng 1', value: 1},
    {label: 'Tháng 2', value: 2},
    {label: 'Tháng 3', value: 3},
    {label: 'Tháng 4', value: 4},
    {label: 'Tháng 5', value: 5},
    {label: 'Tháng 6', value: 6},
    {label: 'Tháng 7', value: 7},
    {label: 'Tháng 8', value: 8},
    {label: 'Tháng 9', value: 9},
    {label: 'Tháng 10', value: 10},
    {label: 'Tháng 11', value: 11},
    {label: 'Tháng 12', value: 12},
  ];

  // Danh sách năm (từ 2020 đến năm hiện tại + 2)
  const currentYear = moment().year();
  const years: {label: string; value: string | number}[] = [
    {label: 'Chọn năm', value: 'all'},
  ];
  for (let year = 2020; year <= currentYear + 2; year++) {
    years.push({label: `Năm ${year}`, value: year});
  }

  const getMonthLabel = () => {
    const month = months.find(m => m.value === selectedMonth);
    return month ? month.label : 'Chọn tháng';
  };

  const getYearLabel = () => {
    const year = years.find(y => y.value === selectedYear);
    return year ? year.label : 'Chọn năm';
  };

  const statusOptopns = [
    {label: 'Hoàn thành', value: 'Hoàn thành'},
    {label: 'Chưa hoàn thành', value: 'Chưa hoàn thành'},
  ];

  const getStausLabel = () => {
    const option = statusOptopns.find(opt => opt.value === status);
    return option ? option.label : 'Chọn trạng thái';
  };

  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = moment(schedule.date);
    const today = moment().startOf('day');

    if (selectedTab === 'upcoming') {
      return scheduleDate.isSameOrAfter(today);
    }

    if (selectedTab === 'schedule') {
      return scheduleDate.isSameOrAfter(today);
    }

    if (selectedTab === 'history') {
      // Xử lý lọc theo khoảng thời gian cho tab 'history'
      let matchesTimeRange = true;
      if (selectedMonth !== 'all' && typeof selectedMonth === 'number') {
        matchesTimeRange =
          matchesTimeRange && scheduleDate.month() + 1 === selectedMonth;
      }
      if (selectedYear !== 'all' && typeof selectedYear === 'number') {
        matchesTimeRange =
          matchesTimeRange && scheduleDate.year() === selectedYear;
      }

      let matchesStatus = false;
      const lowerStatus = schedule.status?.toLowerCase();

      switch (status) {
        case 'Hoàn thành':
          // Check for completed status (handle different cases)
          matchesStatus =
            lowerStatus === 'đã hoàn thành' ||
            lowerStatus === 'hoàn thành' ||
            lowerStatus === 'completed';
          break;
        case 'Chưa hoàn thành':
          // Show only items with "Chưa hoàn thành" status
          matchesStatus = lowerStatus === 'chưa hoàn thành';
          break;
        default:
          matchesStatus = true;
      }

      return matchesTimeRange && matchesStatus;
    }

    return true;
  });

  const markedDates = schedules.reduce((acc, schedule) => {
    const date = moment(schedule.date).format('YYYY-MM-DD');
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
          <SegmentedButtons
            value={selectedTab}
            onValueChange={setSelectedTab}
            buttons={[
              {value: 'upcoming', label: 'Sắp đến'},
              {value: 'schedule', label: 'Lịch'},
              {value: 'history', label: 'Lịch sử'},
            ]}
            style={styles.tabs}
          />

          {selectedTab === 'upcoming' && <UpcomingCalendar />}

          {selectedTab === 'history' && (
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 20,
                  width: 'auto',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Menu
                  visible={monthMenuVisible}
                  onDismiss={() => setMonthMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setMonthMenuVisible(true)}
                      style={styles.timeRangeButton}>
                      {getMonthLabel()}
                    </Button>
                  }>
                  {months.map(month => (
                    <Menu.Item
                      key={month.value}
                      onPress={() => {
                        setSelectedMonth(month.value);
                        setMonthMenuVisible(false);
                      }}
                      title={month.label}
                    />
                  ))}
                </Menu>

                <Menu
                  visible={yearMenuVisible}
                  onDismiss={() => setYearMenuVisible(false)}
                  anchor={
                    <Button
                      style={styles.timeRangeButton}
                      mode="outlined"
                      onPress={() => setYearMenuVisible(true)}>
                      {getYearLabel()}
                    </Button>
                  }>
                  {years.map(year => (
                    <Menu.Item
                      key={year.value}
                      onPress={() => {
                        setSelectedYear(year.value);
                        setYearMenuVisible(false);
                      }}
                      title={year.label}
                    />
                  ))}
                </Menu>
              </View>
              <View>
                <Menu
                  visible={menuStatusVisible}
                  onDismiss={() => setMenuStatusVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setMenuStatusVisible(true)}
                      style={styles.timeRangeButton}>
                      {getStausLabel()}
                    </Button>
                  }>
                  {statusOptopns.map(option => (
                    <Menu.Item
                      key={option.value}
                      onPress={() => {
                        // TODO: set status
                        setStatus(option.value);
                        setMenuStatusVisible(false);
                      }}
                      title={option.label}
                    />
                  ))}
                </Menu>
              </View>
              <ScheduleList
                scheduleDetails={filteredSchedules}
                showRating={true}
              />
            </View>
          )}

          {selectedTab === 'schedule' && (
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
                <ScheduleList
                  scheduleDetails={schedules.filter(
                    x =>
                      format(parseISO(x.date), 'yyyy-MM-dd') === selectedDate,
                  )}
                />
              </View>
            </ScrollView>
          )}
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
});
