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

export default function SupervisorScheduleList({scheduleDetails, onUpdate}: IProps) {
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleDetails | null>(null);
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

    try {
      // Sử dụng format API mới theo Swagger documentation
      const ratingData = {
        scheduleDetailId: selectedSchedule.scheduleDetailId,
        ratingvalue: rating,
        comment: comment || '',
      };

      console.log('Rating data:', ratingData);

      const response = await api.post(
        API_URLS.SCHEDULE_DETAILS.RATE(selectedSchedule.scheduleDetailId), 
        ratingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Rating response:', response);

      if (response.status === 200) {
        showSnackbar?.success('Đánh giá đã được gửi');
        onUpdate?.();
        
        // Reset state
        setRatingDialogVisible(false);
        setSelectedSchedule(null);
        setRating(0);
        setComment('');
      }
    } catch (error: any) {
      console.error('Error rating:', error);
      showSnackbar?.error('Không thể đánh giá. Vui lòng thử lại');
    }
  };

  const getTimeRange = (startTime: string, endTime: string) => {
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

  const renderSupervisorActions = (schedule: ScheduleDetails) => {
    if (!schedule.workerId) return null;

    return (
      <View style={styles.supervisorActions}>
        {/* Worker Info Row - Luôn hiển thị */}
        <View style={styles.workerRow}>
          <Text style={styles.workerLabel}>Nhân viên: {schedule.workerId}</Text>
          <View style={styles.actionButtons}>
            <IconButton
              icon="star"
              size={20}
              iconColor={colors.warning}
              onPress={() => {
                setSelectedSchedule(schedule);
                setRatingDialogVisible(true);
              }}
            />
            {schedule.evidenceImage && (
              <Button
                mode="outlined"
                icon="image"
                onPress={() => handleViewImage(schedule.evidenceImage!)}
                style={styles.evidenceImageButton}
                compact
              >
                ảnh
              </Button>
            )}
          </View>
        </View>
        
        {/* Rating Display - Hiển thị riêng biệt */}
        {schedule.rating && (
          <View style={styles.ratingDisplayContainer}>
            <RatingDisplay
              rating={schedule.rating}
              comment=""
            />
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
                      <Surface style={styles.scheduleIconContainer} elevation={1}>
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
                                backgroundColor: getStatusColor(schedule.status),
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
                      <View style={styles.infoItem}>
                        <IconButton
                          icon="briefcase"
                          size={16}
                          iconColor={colors.subLabel}
                        />
                        <View>
                          <Text style={styles.infoLabel}>Công việc</Text>
                          <Text style={styles.infoValue}>
                            {schedule.assignmentName}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.infoItem}>
                        <IconButton
                          icon="map-marker"
                          size={16}
                          iconColor={colors.subLabel}
                        />
                        <View>
                          <Text style={styles.infoLabel}>Khu vực</Text>
                          <Text style={styles.infoValue}>
                            {schedule.areaName}
                          </Text>
                        </View>
                      </View>
                      {schedule.schedule.restroom && (
                        <View style={styles.infoItem}>
                          <IconButton
                            icon="toilet"
                            size={16}
                            iconColor={colors.subLabel}
                          />
                          <View>
                            <Text style={styles.infoLabel}>Nhà vệ sinh</Text>
                            <Text style={styles.infoValue}>
                              {schedule.schedule.restroomNumber}
                            </Text>
                          </View>
                        </View>
                      )}
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

        {/* Image Display Dialog */}
        <Dialog
          visible={imageDialogVisible}
          onDismiss={() => {
            setImageDialogVisible(false);
            setSelectedImage('');
          }}
        >
          <Dialog.Title>Ảnh chứng minh</Dialog.Title>
          <Dialog.Content>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
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
    alignItems: 'center',
    backgroundColor: colors.grey,
    padding: 12,
    borderRadius: 8,
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
  },
  supervisorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  workerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 2,
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
    fontWeight: '600',
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
  },
}); 