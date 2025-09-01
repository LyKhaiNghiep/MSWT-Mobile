import {format, parseISO} from 'date-fns';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import {ScheduleDetails} from '../../config/models/scheduleDetails.model';
import {API_URLS} from '../../constants/api-urls';
import api from '../../services/api';
import {colors} from '../../theme';
import {showSnackbar} from '../../utils/snackbar';
import {Rating} from '../Rating';
import {RatingDisplay} from '../Rating/RatingDisplay';

interface IProps {
  scheduleDetails: ScheduleDetails[];
  onUpdate?: () => void;
}

export default function SupervisorScheduleList({
  scheduleDetails,
  onUpdate,
}: IProps) {
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleDetails | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageDialogVisible, setImageDialogVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const groupByDate = (schedules: ScheduleDetails[]) => {
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

  const groupedSchedulesObject = groupByDate(scheduleDetails);

  // Convert object to array format for easier rendering
  const groupedSchedules = Object.entries(groupedSchedulesObject).map(
    ([date, schedules]) => ({
      date,
      schedules,
    }),
  );

  const handleRate = async () => {
    if (!selectedSchedule) return;
    if (!rating || rating < 1) {
      showSnackbar?.error('Vui lòng chọn số sao trước khi gửi');
      return;
    }

    try {
      // PUT /api/scheduledetails/scheduledetails/rating/{id}
      const ratingData = {
        rating: rating, // ✅ Sửa từ 'ratingvalue' thành 'rating'
        comment: comment || '',
      };

      console.log('Rating data:', ratingData);
      console.log(
        'Rating URL:',
        API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleDetailId),
      );
      console.log('Full request:', {
        method: 'PUT',
        url: API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleDetailId),
        data: ratingData,
        headers: {'Content-Type': 'application/json'},
      });

      const response = await api.put(
        API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleDetailId),
        ratingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Rating response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.status === 200) {
        showSnackbar?.success('Đánh giá đã được gửi');

        // Reset state
        setRatingDialogVisible(false);
        setSelectedSchedule(null);
        setRating(0);
        setComment('');

        // Force refresh data
        onUpdate?.();

        // Debug log
        console.log('Rating submitted successfully, refreshing data...');
      }
    } catch (error: any) {
      console.error('Error rating:', error);
      showSnackbar?.error('Không thể đánh giá. Vui lòng thử lại');
    }
  };

  const getTimeRange = (startTime: string, endTime: string | null) => {
    if (!endTime) {
      return `${startTime}`;
    }
    return `${startTime} - ${endTime}`;
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'hoàn thành':
      case 'đã hoàn thành':
        return 'green';
      case 'sắp tới':
        return 'orange';
      case 'đang làm':
        return '#007AFF';
      case 'bỏ lỡ':
        return 'red';
      default:
        return 'grey';
    }
  };

  const getScheduleTypeColor = (scheduleType: string) => {
    switch (scheduleType?.toLowerCase()) {
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

  // Helper function to get valid rating value
  const getRatingValue = (rating: any) => {
    console.log('getRatingValue input:', rating, 'type:', typeof rating);

    if (!rating) {
      console.log('getRatingValue: no rating, returning 0');
      return 0;
    }

    if (typeof rating === 'string') {
      const cleaned = rating.trim();
      console.log('getRatingValue: cleaned string:', `"${cleaned}"`);

      if (!cleaned) {
        console.log('getRatingValue: empty after trim, returning 0');
        return 0;
      }

      const parsed = parseFloat(cleaned);
      console.log(
        'getRatingValue: parsed result:',
        parsed,
        'isNaN:',
        isNaN(parsed),
      );

      if (isNaN(parsed)) {
        console.log('getRatingValue: NaN result, returning 0');
        return 0;
      }

      console.log('getRatingValue: final result:', parsed);
      return parsed;
    }

    console.log('getRatingValue: non-string, returning:', rating);
    return rating;
  };

  const renderSupervisorActions = (schedule: ScheduleDetails) => {
    if (!schedule.workers || schedule.workers.length === 0) return null;

    const ratingValue = getRatingValue(schedule.rating);
    const hasValidRating = ratingValue > 0;

    return (
      <View style={styles.supervisorActions}>
        {/* Worker Info Row - Luôn hiển thị */}
        <View style={styles.workerRow}>
          <Text style={styles.workerLabel}>
            Nhân viên: {schedule.workers.map(w => w.fullName).join(', ')}
          </Text>
          <View style={styles.actionButtons}>
            {!hasValidRating && (
              <IconButton
                icon="star"
                size={20}
                iconColor={colors.warning}
                onPress={() => {
                  setSelectedSchedule(schedule);
                  setRatingDialogVisible(true);
                }}
                style={styles.ratingStarButton}
              />
            )}
          </View>
        </View>

        {/* Rating Display - Hiển thị đánh giá và nhận xét */}
        {hasValidRating && (
          <View style={styles.ratingDisplayContainer}>
            <RatingDisplay
              rating={ratingValue}
              comment={schedule.comment || undefined}
              maxRating={5}
            />
          </View>
        )}

        {/* Comment Display - Hiển thị comment riêng biệt nếu có */}
        {!hasValidRating && schedule.comment && schedule.comment.trim() && (
          <View style={styles.commentOnlyContainer}>
            <Text style={styles.commentOnlyText}>{schedule.comment}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {groupedSchedules?.map(({date, schedules}) => (
          <Surface key={date} style={styles.modernDateSection} elevation={2}>
            <View style={styles.modernDateHeader}>
              <View style={styles.dateHeaderLeft}>
                <Surface style={styles.dateIconContainer} elevation={1}>
                  <IconButton
                    icon="calendar"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.dateIcon}
                  />
                </Surface>
                <View>
                  <Text style={styles.dateLabel}>
                    {new Date(date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.dateSubtitle}>
                    {schedules.length} công việc
                  </Text>
                </View>
              </View>
            </View>

            {schedules.map((schedule: ScheduleDetails) => (
              <Card
                key={schedule.scheduleDetailId}
                style={styles.modernScheduleCard}>
                <Card.Content style={styles.modernCardContent}>
                  <View style={styles.modernScheduleHeader}>
                    <View style={styles.headerLeft}>
                      <Surface
                        style={styles.scheduleIconContainer}
                        elevation={1}>
                        <IconButton
                          icon={getScheduleTypeIcon(
                            schedule.schedule.scheduleType,
                          )}
                          size={18}
                          iconColor={getScheduleTypeColor(
                            schedule.schedule.scheduleType,
                          )}
                        />
                      </Surface>
                      <View style={styles.headerText}>
                        <Text style={styles.modernTimeText}>
                          {getTimeRange(schedule.startTime, schedule.endTime)}
                        </Text>
                        <View style={styles.modernChipContainer}>
                          <Chip
                            style={[
                              styles.modernTypeChip,
                              {
                                backgroundColor: getStatusColor(
                                  schedule.status,
                                ),
                              },
                            ]}
                            textStyle={styles.modernChipText}>
                            {schedule.status}
                          </Chip>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Divider style={styles.modernDivider} />

                  <View style={styles.modernInfoContainer}>
                    <View style={styles.infoGrid}>
                      {/* Lịch làm việc */}
                      <View style={styles.infoItem}>
                        <View style={styles.textContainer}>
                          <Text style={styles.infoLabel}>Lịch làm việc</Text>
                          <Text style={styles.infoValue}>
                            {schedule.schedule?.scheduleName || 'Không có thông tin'}
                          </Text>
                        </View>
                      </View>

                      {/* Khu vực */}
                      <View style={styles.infoItem}>
                        <View style={styles.textContainer}>
                          <Text style={styles.infoLabel}>Khu vực</Text>
                          <Text style={styles.infoValue}>
                            {schedule.areaName || 'Không có thông tin khu vực'}
                          </Text>
                        </View>
                      </View>

                      {/* Công việc */}
                      <View style={styles.infoItem}>
                        <View style={styles.textContainer}>
                          <Text style={styles.infoLabel}>Công việc</Text>
                          <Text style={styles.infoValue}>
                            {schedule.assignments && schedule.assignments.length > 0
                              ? schedule.assignments.map((assignment, index) => 
                                  `${index + 1}. ${assignment.assigmentName}`
                                ).join(', ')
                              : 'Không có thông tin công việc'}
                          </Text>
                        </View>
                      </View>

                                                                    {/* Mô tả */}
                        <View style={styles.infoItem}>
                          <View style={styles.textContainer}>
                            <Text style={styles.infoLabel}>Mô tả</Text>
                            <Text style={styles.infoValue}>
                              {schedule.description || 'Không có thông tin mô tả'}
                            </Text>
                          </View>
                        </View>

                                               {/* Work Group Member Names */}
                        <View style={styles.infoItem}>
                          <View style={styles.textContainer}>
                            <Text style={styles.infoLabel}>Nhân viên phụ trách </Text>
                            <Text style={styles.infoValue}>
                              {schedule.workers && schedule.workers.length > 0
                                ? schedule.workers.map((worker, index) => 
                                    `${index + 1}. ${worker.fullName}`
                                  ).join(', ')
                                : 'Không có thông tin work group member names'}
                            </Text>
                          </View>
                        </View>

                       {renderSupervisorActions(schedule)}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Surface>
        ))}
      </ScrollView>

      <Portal>
        <Dialog
          visible={ratingDialogVisible}
          onDismiss={() => {
            setRatingDialogVisible(false);
            setSelectedSchedule(null);
            setRating(0);
            setComment('');
          }}>
          <Dialog.Title>Đánh giá nhân viên</Dialog.Title>
          <Dialog.Content>
            <View style={styles.ratingContainer}>
              <Rating value={rating} onValueChange={setRating} size={30} />
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

        {/* Image Display Dialog */}
        <Dialog
          visible={imageDialogVisible}
          onDismiss={() => {
            setImageDialogVisible(false);
            setSelectedImage('');
          }}>
          <Dialog.Title>Ảnh chứng minh</Dialog.Title>
          <Dialog.Content>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: selectedImage}}
                style={styles.evidenceImage}
                resizeMode="contain"
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setImageDialogVisible(false)}>Đóng</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  modernScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  container: {
    backgroundColor: colors.white,
  },
  modernDateSection: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  modernDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.secondary2,
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  dateSubtitle: {
    fontSize: 14,
    color: colors.subLabel,
  },
  progressContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
  },
  modernScheduleCard: {
    margin: 1,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: colors.white,
  },
  modernCardContent: {
    padding: 16,
  },
  scheduleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  modernChipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modernTypeChip: {},
  modernChipText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  modernDivider: {
    backgroundColor: colors.line,
    marginVertical: 16,
  },
  modernInfoContainer: {
    gap: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.subLabel,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  supervisorActions: {
    backgroundColor: colors.secondary2,
    padding: 12,
    borderRadius: 8,
  },
  workerInfo: {
    flex: 1,
  },
  workerLabel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'WorkSans-SemiBold',
    flex: 1,
  },
  workerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary2,
    padding: 12,
    borderRadius: 8,
  },
  workerAvatar: {
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  workerName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    lineHeight: 18,
  },
  ratingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  modernDialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    color: colors.primary,
    fontWeight: '700',
  },
  modernRatingContainer: {
    gap: 20,
  },
  ratingSection: {
    backgroundColor: colors.grey,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  modernCommentInput: {
    backgroundColor: colors.white,
  },
  dialogActions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cancelButton: {
    borderColor: colors.inputStroke,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.subLabel,
  },
  errorContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.subLabel,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 32,
    margin: 16,
    alignItems: 'center',
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

  workerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary2,
    padding: 8,
    borderRadius: 8,
  },

  ratingText: {
    color: colors.warning,
    marginLeft: 4,
  },

  commentInput: {
    width: '100%',
    marginTop: 16,
  },
  completeButton: {
    marginTop: 16,
    backgroundColor: colors.success,
  },
  evidenceImageContainer: {
    marginTop: 12,
  },
  evidenceImageButton: {
    borderRadius: 8,
    height: 32,
    paddingHorizontal: 8,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  evidenceImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingDisplayContainer: {
    marginTop: 8,
    backgroundColor: colors.grey,
    padding: 8,
    borderRadius: 6,
  },
  ratingStarButton: {
    margin: 0,
    padding: 0,
  },
  commentOnlyContainer: {
    backgroundColor: colors.grey,
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  commentOnlyText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 16,
    fontFamily: 'WorkSans-Regular',
  },
});
