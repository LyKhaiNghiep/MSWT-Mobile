import moment from 'moment';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {
  Button,
  Card,
  Divider,
  Menu,
  Provider,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import UpcomingCalendar from '../../components/Calendar/Upcoming';
import {Schedule} from '../../config/models/schedule.model';
import {useSchedules} from '../../hooks/useSchedule';
import {colors} from '../../theme';
import {isEmpty} from '../../utils';
import {useScheduleDetails} from '../../hooks';
import {useAuth} from '../../contexts/AuthContext';

export default function MyCalendar() {
  const {user} = useAuth();
  console.log('userId', user?.userId);
  const {schedules} = useSchedules(user?.userId);

  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [menuStatusVisible, setMenuStatusVisible] = useState(false);
  const [status, setStatus] = useState('Đã hoàn thành');

  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [monthMenuVisible, setMonthMenuVisible] = useState(false);
  const [yearMenuVisible, setYearMenuVisible] = useState(false);

  const months = [
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
  const years = [];
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
    {label: 'Đã hoàn thành', value: 'Đã hoàn thành'},
    {label: 'Bỏ lỡ', value: 'Bỏ lỡ'},
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

    // Xử lý lọc theo khoảng thời gian cho tab 'schedule'
    let matchesTimeRange =
      scheduleDate.month() + 1 === selectedMonth &&
      scheduleDate.year() === selectedYear;

    let matchesStatus = false;
    switch (status) {
      case 'Đã hoàn thành':
        matchesStatus =
          schedule.status === 'Đã hoàn thành' || isEmpty(schedule.status);
        break;
      case 'Bỏ lỡ':
        matchesStatus = schedule.status === 'Bỏ lỡ';
        break;
      default:
        matchesStatus = true;
    }

    return matchesTimeRange && matchesStatus;
  });

  const renderScheduleItem = ({item}: {item: Schedule}) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">{item.scheduleName}</Text>
          <View style={[styles.statusBadge]}>
            <Text>Đã hoàn thành</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.content}>
          <Text>
            Thời gian: {moment(item.startDate).format('HH:mm')} -{' '}
            {moment(item.endDate).format('HH:mm')}
          </Text>
          <Text>
            Địa điểm: {item.areaName} - {item.restroomNumber || 'N/A'}
          </Text>
          <Text>Loại công việc: {item.scheduleType}</Text>
        </View>
      </Card.Content>
    </Card>
  );
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

              <FlatList
                data={filteredSchedules}
                renderItem={renderScheduleItem}
                keyExtractor={item => item.scheduleId}
                ListEmptyComponent={
                  <View style={styles.centerContent}>
                    <Text style={styles.emptyText}>Không có lịch nào</Text>
                  </View>
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
              />
            </View>
          )}

          {selectedTab === 'schedule' && (
            <Calendar
              current={selectedDate}
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
              markedDates={{
                ...markedDates,

                [selectedDate]: {
                  selected: true,
                  marked: markedDates[selectedDate]?.marked!,
                  dotColor: markedDates[selectedDate]?.dotColor,
                },
              }}
              theme={{
                selectedDayBackgroundColor: '#FF4B2B',
                todayTextColor: '#FF4B2B',
                dotColor: '#FF4B2B',
                arrowColor: '#FF4B2B',
              }}
            />
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
