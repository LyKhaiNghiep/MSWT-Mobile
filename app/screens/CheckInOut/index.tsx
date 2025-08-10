import {format} from 'date-fns';
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Badge,
  Button,
  Card,
  IconButton,
  Provider,
  SegmentedButtons,
  Surface,
  Text,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {CheckInOut} from '../../config/models/check-in-out.model';
import {API_URLS} from '../../constants/api-urls';
import {useCheckInOut} from '../../hooks/useCheckInOut';
import api from '../../services/api';
import {colors} from '../../theme';
import {showSnackbar} from '../../utils/snackbar';
// Add this import at the top
import {Calendar} from 'react-native-calendars';

export default function CheckInOutPage() {
  const {data, isLoading, mutate} = useCheckInOut();
  const [currentTime, setCurrentTime] = useState(moment());
  const [selectedTab, setSelectedTab] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  // Move selectedDate hook to the top
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  // Move all useMemo hooks to the top as well
  const todayData = useMemo(() => {
    if (!data) return [];
    const today = moment().format('YYYY-MM-DD');
    return data.filter(item => {
      const itemDate = moment(item.createdAt || item.attendanceDate).format(
        'YYYY-MM-DD',
      );
      return itemDate === today;
    });
  }, [data]);

  const historyData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const date = new Date(item.createdAt || item.attendanceDate);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [data, selectedMonth, selectedYear]);

  const markedDates = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc, record) => {
      const date = moment(record.createdAt || record.attendanceDate).format(
        'YYYY-MM-DD',
      );
      return {
        ...acc,
        [date]: {
          marked: true,
          dotColor: colors.primary,
          selected: date === selectedDate,
          selectedColor: colors.primary,
        },
      };
    }, {});
  }, [data, selectedDate]);

  const selectedDateRecords = useMemo(() => {
    if (!data) return [];
    return data.filter(record => {
      const recordDate = moment(
        record.createdAt || record.attendanceDate,
      ).format('YYYY-MM-DD');
      return recordDate === selectedDate;
    });
  }, [data, selectedDate]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post(API_URLS.CHECK_IN_OUT.CHECK_IN);

      mutate();
    } catch (error: any) {
      showSnackbar.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post(API_URLS.CHECK_IN_OUT.CHECK_OUT);
      mutate();
    } catch (error: any) {
      showSnackbar.error(error);
    }
  };
  const getShiftFromTime = (time: string) => {
    const hour = moment(time).hour();
    if (hour >= 5 && hour < 12) return 1;
    if (hour >= 13 && hour < 21) return 2;
    return 0;
  };

  const renderAttendanceStatus = () => {
    return <View style={styles.shiftsContainer}>{renderShiftStatus(1)}</View>;
  };

  const renderItem = ({item}: {item: CheckInOut}) => {
    const shiftNumber = getShiftFromTime(item.checkInTime);
    const shiftTime = shiftNumber === 1 ? '5:00 - 13:00' : '13:00 - 21:00';

    return (
      <Surface style={styles.surface} elevation={4}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardContent}>
            <View style={styles.mainContent}>
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: colors.primary + '15'},
                    ]}>
                    <IconButton
                      icon="account-clock"
                      size={28}
                      iconColor={colors.primary}
                    />
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text variant="titleMedium" style={styles.shiftIndicator}>
                      Ca {shiftNumber} ({shiftTime})
                    </Text>
                    <View style={styles.timeRow}>
                      <IconButton
                        icon="login"
                        size={16}
                        iconColor={colors.success}
                        style={styles.smallIcon}
                      />
                      <Text
                        variant="bodySmall"
                        style={[styles.subtitle, styles.timeText]}>
                        {format(new Date(item.checkInTime), 'HH:mm:ss')}
                      </Text>
                    </View>
                    {item.checkOutTime && (
                      <View style={styles.timeRow}>
                        <IconButton
                          icon="logout"
                          size={16}
                          iconColor={colors.error}
                          style={styles.smallIcon}
                        />
                        <Text
                          variant="bodySmall"
                          style={[styles.subtitle, styles.timeText]}>
                          {format(new Date(item.checkOutTime), 'HH:mm:ss')}
                        </Text>
                      </View>
                    )}
                    <Badge
                      style={[
                        styles.badge,
                        {
                          backgroundColor: item.checkOutTime
                            ? colors.success
                            : colors.warning,
                        },
                      ]}>
                      {item.status}
                    </Badge>
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Surface>
    );
  };

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Điểm danh" />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const getShiftRecords = () => {
    return todayData;
  };

  const renderShiftStatus = (shiftNumber: number) => {
    const shiftRecords = getShiftRecords();
    const shiftTime = shiftNumber === 1 ? '5:00 - 13:00' : '13:00 - 21:00';

    if (shiftRecords.length === 0) {
      return (
        <View>
          <Button
            mode="contained"
            onPress={handleCheckIn}
            style={styles.button}>
            Check In
          </Button>
        </View>
      );
    }

    const latestRecord = shiftRecords[shiftRecords.length - 1];
    if (!latestRecord.checkOutTime) {
      return (
        <Button
          mode="contained"
          onPress={handleCheckOut}
          style={{...styles.button, backgroundColor: colors.greenDark}}>
          Check Out
        </Button>
      );
    }

    return (
      <View style={styles.shiftContainer}>
        <Text variant="titleMedium" style={styles.shiftTitle}>
          Ca {shiftNumber} ({shiftTime})
        </Text>
        <Text style={styles.message}>Đã hoàn thành điểm danh</Text>
      </View>
    );
  };

  return (
    <Screen useDefault>
      <AppHeader title="Điểm danh" />
      <Provider>
        <View style={styles.container}>
          <SegmentedButtons
            value={selectedTab}
            onValueChange={setSelectedTab}
            style={styles.segmentedButtons}
            buttons={[
              {value: 'today', label: 'Hôm nay'},
              {value: 'history', label: 'Lịch sử'},
            ]}
          />

          {selectedTab === 'history' && (
            <View style={styles.historyContainer}>
              <Calendar
                current={`${selectedYear}-${String(selectedMonth).padStart(
                  2,
                  '0',
                )}-01`}
                onMonthChange={(date: any) => {
                  setSelectedMonth(date.month + 1);
                  setSelectedYear(date.year);
                  setSelectedDate(
                    new Date(date.year, date.month + 1, 1).toString(),
                  );
                }}
                onDayPress={(day: any) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  selectedDayBackgroundColor: colors.primary,
                  todayTextColor: colors.primary,
                  dotColor: colors.primary,
                  arrowColor: colors.primary,
                }}
              />

              {selectedDateRecords.length > 0 ? (
                <View style={styles.detailsContainer}>
                  {selectedDateRecords.map(record => (
                    <Surface
                      key={record.id}
                      style={styles.surface}
                      elevation={4}>
                      <Card style={styles.card} mode="elevated">
                        <Card.Content style={styles.cardContent}>
                          <View style={styles.mainContent}>
                            <View style={styles.header}>
                              <View style={styles.titleContainer}>
                                <View
                                  style={[
                                    styles.iconContainer,
                                    {backgroundColor: colors.primary + '15'},
                                  ]}>
                                  <IconButton
                                    icon="account-clock"
                                    size={28}
                                    iconColor={colors.primary}
                                  />
                                </View>
                                <View style={styles.titleWrapper}>
                                  <Text
                                    variant="titleMedium"
                                    style={styles.shiftIndicator}>
                                    Ca {getShiftFromTime(record.checkInTime)}
                                  </Text>
                                  <View style={styles.timeRow}>
                                    <IconButton
                                      icon="login"
                                      size={16}
                                      iconColor={colors.success}
                                      style={styles.smallIcon}
                                    />
                                    <Text
                                      variant="bodySmall"
                                      style={[
                                        styles.subtitle,
                                        styles.timeText,
                                      ]}>
                                      {format(
                                        new Date(record.checkInTime),
                                        'HH:mm:ss',
                                      )}
                                    </Text>
                                  </View>
                                  {record.checkOutTime && (
                                    <View style={styles.timeRow}>
                                      <IconButton
                                        icon="logout"
                                        size={16}
                                        iconColor={colors.error}
                                        style={styles.smallIcon}
                                      />
                                      <Text
                                        variant="bodySmall"
                                        style={[
                                          styles.subtitle,
                                          styles.timeText,
                                        ]}>
                                        {format(
                                          new Date(record.checkOutTime),
                                          'HH:mm:ss',
                                        )}
                                      </Text>
                                    </View>
                                  )}
                                  <Badge
                                    style={[
                                      styles.badge,
                                      {
                                        backgroundColor: record.checkOutTime
                                          ? colors.success
                                          : colors.warning,
                                      },
                                    ]}>
                                    {record.status}
                                  </Badge>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </Surface>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Không có dữ liệu cho ngày{' '}
                    {format(new Date(selectedDate), 'dd/MM/yyyy')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {selectedTab === 'today' && (
            <>
              <View style={styles.timeContainer}>
                <Text style={styles.currentTime}>
                  {currentTime.format('HH:mm:ss')}
                </Text>
                <Text style={styles.date}>
                  {currentTime.toDate().toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              {renderAttendanceStatus()}
              <FlatList
                data={selectedTab === 'today' ? todayData : historyData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                  <View style={styles.centerContent}>
                    <Text variant="bodyLarge" style={styles.emptyText}>
                      {selectedTab === 'today'
                        ? 'Không có điểm danh hôm nay'
                        : 'Không có lịch sử điểm danh'}
                    </Text>
                  </View>
                }
                removeClippedSubviews={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </>
          )}
        </View>
      </Provider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  shiftsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  shiftContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  shiftTitle: {
    color: colors.primary,
    marginBottom: 8,
    fontWeight: 'bold',
  },

  shiftIndicator: {
    color: colors.primary,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    color: 'red',
  },
  detailsContainer: {
    padding: 16,
    gap: 8,
  },
  historyContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  smallIcon: {
    margin: 0,
    padding: 0,
    marginRight: -4,
  },
  timeText: {
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  emptyText: {
    color: 'red',
    fontSize: 16,
  },
  timeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  currentTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  date: {
    color: 'blue',
    marginTop: 5,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },

  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  button: {},
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {},
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  surface: {
    borderRadius: 12,
    backgroundColor: colors.white,
    marginHorizontal: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 2,
  },
  subtitle: {
    color: colors.subLabel,
  },
  mainContent: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  title: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  infoContainer: {
    marginTop: 4,
  },
  label: {
    color: colors.subLabel,
    marginBottom: 2,
  },
  value: {
    color: colors.darkLabel,
  },
  chevron: {
    margin: 0,
    padding: 0,
  },
  separator: {
    height: 12,
  },

  segmentedButtons: {
    marginBottom: 16,
  },
});
