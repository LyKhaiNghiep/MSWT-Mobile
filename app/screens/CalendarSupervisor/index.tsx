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
  IconButton,
  Portal,
  Dialog,
  TextInput,
  Button,
  Provider,
} from 'react-native-paper';
import {colors} from '../../theme';
import {format, parseISO, isToday, isTomorrow, isYesterday} from 'date-fns';
import {vi} from 'date-fns/locale';
import {useScheduleDetails} from '../../hooks/useScheduleDetails';
import {useAuth} from '../../contexts/AuthContext';
import {API_URLS} from '../../constants/api-urls';
import api from '../../services/api';
import {Rating} from '../../components/Rating';
import {RatingDisplay} from '../../components/Rating/RatingDisplay';

export default function CalendarSupervisor() {
  const {user} = useAuth();
  const userId = user?.userId;
  const {scheduleDetails, isLoading, error, mutate} = useScheduleDetails(userId);
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

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
      case 'dọn dẹp':
        return colors.primary;
      case 'maintenance':
      case 'bảo trì':
        return colors.secondary1;
      case 'inspection':
      case 'kiểm tra':
        return colors.success;
      default:
        return colors.grey;
    }
  };

  const getScheduleTypeIcon = (scheduleType: string) => {
    switch (scheduleType?.toLowerCase()) {
      case 'cleaning':
      case 'dọn dẹp':
        return 'broom';
      case 'maintenance':
      case 'bảo trì':
        return 'wrench';
      case 'inspection':
      case 'kiểm tra':
        return 'magnify';
      default:
        return 'calendar';
    }
  };

  const handleRate = async () => {
    if (!selectedSchedule) return;

    try {
      // Tạo chuỗi rating với format: "rating,comment"
      const ratingData = `${rating},${comment || ''}`;

      console.log('Selected Schedule:', selectedSchedule);
      console.log('Rating data:', ratingData);
      console.log('Rating URL:', API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleDetailId));

      const response = await api.put(
        API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleDetailId), 
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
      <Provider>
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
          ) :
            Object.entries(groupedSchedules).map(([date, schedules]) => (
              <Surface key={date} style={styles.dateSection} elevation={2}>
                <View style={styles.dateHeader}>
                  <View style={styles.dateHeaderLeft}>
                    <IconButton
                      icon="calendar"
                      size={24}
                      iconColor={colors.primary}
                      style={styles.dateIcon}
                    />
                    <Text style={styles.dateLabel}>{getDateLabel(date)}</Text>
                  </View>
                  <Badge style={styles.scheduleCount}>
                    {`${schedules.length} lịch`}
                  </Badge>
                </View>
                
                {schedules.map((schedule) => (
                  <Card key={schedule.scheduleDetailId} style={styles.scheduleCard}>
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.scheduleHeader}>
                        <View style={styles.headerLeft}>
                          <Avatar.Icon 
                            size={40} 
                            icon={getScheduleTypeIcon(schedule.schedule.scheduleType)}
                            style={{
                              backgroundColor: getScheduleTypeColor(schedule.schedule.scheduleType)
                            }} 
                          />
                          <View style={styles.headerText}>
                            <Text style={styles.timeText}>
                              {getTimeRange(schedule.startTime, schedule.endTime)}
                            </Text>
                            <View style={styles.chipContainer}>
                              <Chip 
                                style={[
                                  styles.typeChip,
                                  {backgroundColor: getStatusColor(schedule.status)}
                                ]}
                                textStyle={styles.chipText}
                              >
                                {schedule.status}
                              </Chip>
                              <Chip 
                                style={[
                                  styles.typeChip,
                                  {backgroundColor: getScheduleTypeColor(schedule.schedule.scheduleType)}
                                ]}
                                textStyle={styles.chipText}
                              >
                                {schedule.schedule.scheduleType}
                              </Chip>
                            </View>
                          </View>
                        </View>
                      </View>

                      <Divider style={styles.divider} />

                      <View style={styles.infoContainer}>
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

                        {schedule.workerName && (
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Nhân viên:</Text>
                            <View style={styles.workerContainer}>
                              <Text style={styles.workerName}>
                                {schedule.workerName}
                              </Text>
                              <IconButton
                                icon="star"
                                size={20}
                                iconColor={colors.warning}
                                onPress={() => {
                                  setSelectedSchedule(schedule);
                                  setRatingDialogVisible(true);
                                }}
                              />
                            </View>
                          </View>
                        )}

                        {schedule.description && (
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Mô tả:</Text>
                            <Text style={styles.infoValue}>
                              {schedule.description}
                            </Text>
                          </View>
                        )}

                        {schedule.schedule.trashBin && (
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Thùng rác:</Text>
                            <Text style={styles.infoValue}>
                              {schedule.schedule.trashBin.location}
                            </Text>
                          </View>
                        )}

                        {schedule.rating && (
                          <RatingDisplay
                            rating={schedule.rating}
                            comment={schedule.comment}
                          />
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </Surface>
            ))
          }
        </ScrollView>

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
  infoLabel: {
    width: 100,
    color: colors.grey,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
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