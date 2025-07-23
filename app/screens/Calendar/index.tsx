import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  Card,
  Divider,
  SegmentedButtons,
  Text,
  Menu,
  Button,
  Provider,
} from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useSchedules} from '../../hooks/useSchedule';
import {Schedule} from '../../config/models/schedule.model';

import {colors} from '../../theme';
import {isEmpty} from '../../utils';

export default function MyCalendar() {
  const {schedules, isLoading} = useSchedules();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [filterStatus, setFilterStatus] = useState('current-month');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuStatusVisible, setMenuStatusVisible] = useState(false);
  const [timeRange, setTimeRange] = useState('current-month');
  const [status, setStatus] = useState('Đã hoàn thành');

  const timeRangeOptions = [
    {label: 'Hôm qua', value: 'yesterday'},
    {label: 'Tuần hiện tại', value: 'current-week'},
    {label: 'Tuần trước', value: 'last-week'},
    {label: 'Tháng hiện tại', value: 'current-month'},
    {label: 'Tháng trước', value: 'last-month'},
    {label: 'Năm hiện tại', value: 'current-year'},
    {label: 'Tất cả', value: 'all'},
  ];

  const statusOptopns = [
    {label: 'Đã hoàn thành', value: 'Đã hoàn thành'},
    {label: 'Bỏ lỡ', value: 'Bỏ lỡ'},
  ];

  const getTimeRangeLabel = () => {
    const option = timeRangeOptions.find(opt => opt.value === timeRange);
    return option ? option.label : 'Chọn thời gian';
  };

  const getStausLabel = () => {
    const option = statusOptopns.find(opt => opt.value === status);
    return option ? option.label : 'Chọn trạng thái';
  };

  const filteredSchedules = schedules.filter(schedule => {
    const scheduleDate = moment(schedule.startDate);
    const today = moment().startOf('day');

    if (selectedTab === 'upcoming') {
      return scheduleDate.isSameOrAfter(today);
    }

    if (selectedTab === 'schedule') {
      return scheduleDate.isSameOrAfter(today);
    }

    // Xử lý lọc theo khoảng thời gian cho tab 'schedule'
    let matchesTimeRange = false;
    switch (timeRange) {
      case 'yesterday':
        matchesTimeRange = scheduleDate.isSame(
          today.clone().subtract(1, 'day'),
          'day',
        );
        break;
      case 'current-week':
        matchesTimeRange = scheduleDate.isSame(today, 'week');
        break;
      case 'last-week':
        matchesTimeRange = scheduleDate.isSame(
          today.clone().subtract(1, 'week'),
          'week',
        );
        break;
      case 'current-month':
        matchesTimeRange = scheduleDate.isSame(today, 'month');
        break;
      case 'last-month':
        matchesTimeRange = scheduleDate.isSame(
          today.clone().subtract(1, 'month'),
          'month',
        );
        break;
      case 'current-year':
        matchesTimeRange = scheduleDate.isSame(today, 'year');
        break;
      case 'all':
        matchesTimeRange = true;
        break;
      default:
        matchesTimeRange = true;
    }

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
    const date = moment(schedule.startDate).format('YYYY-MM-DD');
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

          {selectedTab === 'history' && (
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
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.timeRangeButton}>
                    {getTimeRangeLabel()}
                  </Button>
                }>
                {timeRangeOptions.map(option => (
                  <Menu.Item
                    key={option.value}
                    onPress={() => {
                      setTimeRange(option.value);
                      setMenuVisible(false);
                    }}
                    title={option.label}
                  />
                ))}
              </Menu>

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
          )}

          {selectedTab === 'schedule' && (
            <View style={styles.calendarPlaceholder}>
              <Text>Calendar view not available</Text>
            </View>
          )}

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
