import React, {useState} from 'react';
import {FlatList, StyleSheet, View, Alert} from 'react-native';
import {
  Card,
  Divider,
  SegmentedButtons,
  Text,
  Menu,
  Button,
  Provider,
  Badge,
  Avatar,
  Chip,
  IconButton,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useSchedules} from '../../hooks/useSchedule';
import {Schedule} from '../../config/models/schedule.model';
import {Calendar} from 'react-native-calendars';
import {colors} from '../../theme';
import {isEmpty} from '../../utils';
import {API_URLS} from '../../constants/api-urls';
import api from '../../services/api';
import {Rating} from '../../components/Rating';
import {RatingDisplay} from '../../components/Rating/RatingDisplay';

// Add description to Schedule type
type ExtendedSchedule = Schedule & {
  description?: string;
  workerName?: string;
  rating?: number;
  comment?: string;
};

export default function MyCalendar() {
  const {schedules, isLoading, mutate} = useSchedules();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [filterStatus, setFilterStatus] = useState('current-month');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuStatusVisible, setMenuStatusVisible] = useState(false);
  const [timeRange, setTimeRange] = useState('current-month');
  const [status, setStatus] = useState('Đã hoàn thành');
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ExtendedSchedule | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const timeRangeOptions = [
    {label: 'Hôm qua', value: 'yesterday'},
    {label: 'Tuần hiện tại', value: 'current-week'},
    {label: 'Tuần trước', value: 'last-week'},
    {label: 'Tháng hiện tại', value: 'current-month'},
    {label: 'Tháng trước', value: 'last-month'},
    {label: 'Năm hiện tại', value: 'current-year'},
    {label: 'Tất cả', value: 'all'},
  ];

  const statusOptions = [
    {label: 'Đã hoàn thành', value: 'Đã hoàn thành'},
    {label: 'Bỏ lỡ', value: 'Bỏ lỡ'},
  ];

  const getTimeRangeLabel = () => {
    const option = timeRangeOptions.find(opt => opt.value === timeRange);
    return option ? option.label : 'Chọn thời gian';
  };

  const getStatusLabel = () => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Chọn trạng thái';
  };

  const getStatusColor = (scheduleStatus: string) => {
    switch (scheduleStatus?.toLowerCase()) {
      case 'đã hoàn thành':
        return colors.success;
      case 'bỏ lỡ':
        return colors.error;
      default:
        return colors.grey;
    }
  };

  const filteredSchedules = schedules.filter((schedule: ExtendedSchedule) => {
    const scheduleDate = moment(schedule.startDate);
    const today = moment().startOf('day');

    if (selectedTab === 'upcoming') {
      return scheduleDate.isSameOrAfter(today);
    }

    if (selectedTab === 'schedule') {
      return scheduleDate.isSameOrAfter(today);
    }

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

  const handleRate = async () => {
    if (!selectedSchedule) return;

    try {
      // Tạo chuỗi rating với format: "rating,comment"
      const ratingData = `${rating},${comment || ''}`;

      console.log('Selected Schedule:', selectedSchedule);
      console.log('Rating data:', ratingData);
      console.log('Rating URL:', API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleId));

      const response = await api.put(
        API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleId), 
        ratingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Rating response:', response);
      
      // Refresh the schedules list
      mutate();
      
      // Reset state
      setRatingDialogVisible(false);
      setSelectedSchedule(null);
      setRating(0);
      setComment('');

      // Thông báo thành công
      Alert.alert(
        'Thành công',
        'Đánh giá đã được gửi.',
        [{text: 'OK'}]
      );
    } catch (error: any) {
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.error('Error response:', error.response ? JSON.stringify(error.response, null, 2) : 'No response');
      console.error('Error request:', error.request ? JSON.stringify(error.request, null, 2) : 'No request');
      console.error('Error config:', error.config ? JSON.stringify(error.config, null, 2) : 'No config');
      
      // Optional: show detailed error message to user
      Alert.alert(
        'Lỗi',
        `Không thể đánh giá. Chi tiết: ${
          error.response?.data?.message || 
          error.message || 
          'Lỗi không xác định'
        }`,
        [{text: 'OK'}]
      );
    }
  };

  const renderScheduleItem = ({item}: {item: ExtendedSchedule}) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar.Icon 
              size={40} 
              icon={item.scheduleType === 'Dọn dẹp' ? 'broom' : 'trash-can'} 
              style={{backgroundColor: colors.primary}} 
            />
            <View style={styles.headerText}>
              <Text variant="titleMedium" style={styles.title}>
                {item.scheduleName}
              </Text>
              <View style={styles.chipContainer}>
                <Chip 
                  style={[
                    styles.typeChip,
                    {backgroundColor: getStatusColor(item.status || 'Đã hoàn thành')}
                  ]}
                  textStyle={styles.chipText}
                >
                  {item.status || 'Đã hoàn thành'}
                </Chip>
                <Chip 
                  style={[
                    styles.typeChip,
                    {backgroundColor: item.scheduleType === 'Dọn dẹp' ? colors.primary : colors.secondary1}
                  ]}
                  textStyle={styles.chipText}
                >
                  {item.scheduleType}
                </Chip>
              </View>
            </View>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>Thời gian:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {moment(item.startDate).format('HH:mm')} - {moment(item.endDate).format('HH:mm')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>Địa điểm:</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {item.areaName} - {item.restroomNumber || 'N/A'}
            </Text>
          </View>
          {item.workerName && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>Nhân viên:</Text>
              <View style={styles.workerContainer}>
                <Text variant="bodyMedium" style={styles.workerName}>
                  {item.workerName}
                </Text>
                <IconButton
                  icon="star"
                  size={20}
                  iconColor={colors.warning}
                  onPress={() => {
                    setSelectedSchedule(item);
                    setRatingDialogVisible(true);
                  }}
                />
              </View>
            </View>
          )}
          {item.description && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.label}>Mô tả:</Text>
              <Text variant="bodyMedium" style={styles.value}>
                {item.description}
              </Text>
            </View>
          )}
          {item.rating && (
            <RatingDisplay
              rating={item.rating}
              comment={item.comment}
            />
          )}
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
        dotColor: colors.primary,
      },
    };
  }, {});

  return (
    <Screen styles={{backgroundColor: colors.white}} useDefault>
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
            <View style={styles.filterContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.filterButton}
                    icon="calendar">
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
                    style={styles.filterButton}
                    icon="filter-variant">
                    {getStatusLabel()}
                  </Button>
                }>
                {statusOptions.map(option => (
                  <Menu.Item
                    key={option.value}
                    onPress={() => {
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

          <FlatList
            data={filteredSchedules}
            renderItem={renderScheduleItem}
            keyExtractor={item => item.scheduleId}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Avatar.Icon 
                  size={80} 
                  icon="calendar-blank" 
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>Không có lịch nào</Text>
              </View>
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Portal>
          <Dialog
            visible={ratingDialogVisible}
            onDismiss={() => {
              setRatingDialogVisible(false);
              setSelectedSchedule(null);
              setRating(0);
              setComment('');
            }}
          >
            <Dialog.Title>Đánh giá nhân viên</Dialog.Title>
            <Dialog.Content>
              <View style={styles.ratingContainer}>
                <Rating
                  value={rating}
                  onValueChange={setRating}
                  size={30}
                />
                <TextInput
                  mode="outlined"
                  label="Nhận xét"
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={3}
                  style={styles.commentInput}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setRatingDialogVisible(false)}>Hủy</Button>
              <Button onPress={handleRate}>Đánh giá</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Provider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabs: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  calendar: {
    height: 100,
    marginBottom: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  calendarHeader: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateNumber: {
    color: colors.primary, // Use primary color instead of text
    fontSize: 14,
  },
  dateName: {
    color: colors.primary, // Use primary color instead of text  
    fontSize: 12,
  },
  highlightDateNumber: {
    color: colors.white,
    fontSize: 14,
  },
  highlightDateName: {
    color: colors.white,
    fontSize: 12,
  },
  disabledDateName: {
    color: colors.grey,
    fontSize: 12,
  },
  disabledDateNumber: {
    color: colors.grey,
    fontSize: 14,
  },
  iconContainer: {
    flex: 0.1,
  },
  card: {
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  title: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.grey,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 12,
  },
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: 100,
    color: colors.grey,
  },
  value: {
    flex: 1,
    color: colors.primary, // Use primary color instead of text
  },
  list: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    backgroundColor: colors.grey,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey,
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
  chipText: {
    color: colors.white,
    fontSize: 12,
  },
  workerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary2,
    padding: 8,
    borderRadius: 8,
  },
  workerName: {
    flex: 1,
    color: colors.primary,
    fontWeight: 'bold',
  },
  ratingText: {
    color: colors.warning,
    marginLeft: 4,
  },
  ratingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  commentInput: {
    width: '100%',
    marginTop: 16,
  },
});
