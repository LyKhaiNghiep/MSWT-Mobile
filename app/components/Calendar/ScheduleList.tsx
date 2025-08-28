import {format, parseISO} from 'date-fns';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
} from 'react-native-paper';
import {ScheduleDetails} from '../../config/models/scheduleDetails.model';
import {API_URLS} from '../../constants/api-urls';
import api from '../../services/api';
import {colors} from '../../theme';
import {showSnackbar} from '../../utils/snackbar';
import {RatingDisplay} from '../Rating/RatingDisplay';

interface IProps {
  scheduleDetails: ScheduleDetails[];
  showRating?: boolean;
  onUpdate?: () => void;
}

export default function ScheduleList({
  scheduleDetails,
  onUpdate,
  showRating = false,
}: IProps) {
  const [isUploading, setIsUploading] = useState(false);

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

  const handleCompleteTask = async (scheduleDetailId: string) => {
    setIsUploading(true);
    try {
      const response = await api.put(
        API_URLS.SCHEDULE_DETAILS.UPDATE_STATUS(scheduleDetailId),
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        showSnackbar?.success('Đã hoàn thành công việc');
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar?.error('Cập nhật trạng thái thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const getTimeRange = (startTime: string, endTime: string | null) => {
    if (!endTime) {
      return `${startTime}`;
    }
    return `${startTime} - ${endTime}`;
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase().trim();
    switch (lowerStatus) {
      case 'hoàn tất':
      case 'đã đóng':
        return 'green';
      case 'sắp tới':
      case 'sap toi':
        return 'orange';
      case 'đang làm':
        return '#007AFF';
      case 'chưa hoàn tất':
        return 'red';
      case 'string': // Handle test data
        return 'grey';
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
  const renderActionButton = (schedule: ScheduleDetails) => {
    switch (schedule.status?.toLowerCase()) {
      case 'đang làm':
        return (
          <Button
            mode="contained"
            onPress={() => handleCompleteTask(schedule.scheduleDetailId)}
            loading={isUploading}
            buttonColor={colors.success}>
            Hoàn thành
          </Button>
        );
      default:
        return null;
    }
  };

  return (
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
                          schedule.schedule?.scheduleType || 'default',
                        )}
                        size={18}
                        iconColor={getScheduleTypeColor(
                          schedule.schedule?.scheduleType || 'default',
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
                        {/* <Chip
                                style={[
                                  styles.modernTypeChip,
                                  {
                                    backgroundColor: getScheduleTypeColor(
                                      schedule.schedule.scheduleType,
                                    ),
                                  },
                                ]}
                                textStyle={styles.modernChipText}>
                                {schedule.schedule.scheduleType}
                              </Chip> */}
                      </View>
                    </View>
                  </View>
                </View>

                <Divider style={styles.modernDivider} />

                <View style={styles.modernInfoContainer}>
                  <View style={styles.infoGrid}>
                    {/* Schedule Name */}
                    <View style={styles.infoItem}>
                      <IconButton
                        icon="calendar-text"
                        size={16}
                        iconColor={colors.subLabel}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.infoLabel}>Lịch làm việc</Text>
                        <Text style={styles.infoValue}>
                          {schedule.schedule.scheduleName}
                        </Text>
                      </View>
                    </View>

                    {/* Area Name */}
                    <View style={styles.infoItem}>
                      <IconButton
                        icon="map-marker"
                        size={16}
                        iconColor={colors.subLabel}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.infoLabel}>Khu vực</Text>
                        <Text style={styles.infoValue}>
                          {schedule.areaName || 'Không có thông tin khu vực'}
                        </Text>
                      </View>
                    </View>

                    {/* Assignments */}
                    {schedule.assignments &&
                      schedule.assignments.length > 0 && (
                        <View style={styles.infoItem}>
                          <IconButton
                            icon="briefcase"
                            size={16}
                            iconColor={colors.subLabel}
                          />
                          <View style={styles.textContainer}>
                            <Text style={styles.infoLabel}>Công việc</Text>
                            {schedule.assignments.map((assignment, index) => (
                              <Text
                                key={assignment.assignmentId}
                                style={styles.infoValue}>
                                {index + 1}. {assignment.assigmentName}
                              </Text>
                            ))}
                          </View>
                        </View>
                      )}

                    {/* Description */}
                    {schedule.description && (
                      <View style={styles.infoItem}>
                        <IconButton
                          icon="text"
                          size={16}
                          iconColor={colors.subLabel}
                        />
                        <View style={styles.textContainer}>
                          <Text style={styles.infoLabel}>Mô tả</Text>
                          <Text style={styles.infoValue}>
                            {schedule.description}
                          </Text>
                        </View>
                      </View>
                    )}
                    {(() => {
                      // Helper function to get valid rating value
                      const getRatingValue = (rating: any) => {
                        if (!rating) {
                          return 0;
                        }
                        if (typeof rating === 'string') {
                          const cleaned = rating.trim();
                          if (!cleaned) {
                            return 0;
                          }
                          const parsed = parseFloat(cleaned);
                          return isNaN(parsed) ? 0 : parsed;
                        }
                        return rating;
                      };

                      const ratingValue = getRatingValue(schedule.rating);
                      const hasValidRating = ratingValue > 0;

                      return (
                        showRating &&
                        hasValidRating && (
                          <View style={styles.infoItem}>
                            <IconButton
                              icon="star"
                              size={16}
                              iconColor={colors.warning}
                            />
                            <View style={styles.textContainer}>
                              <Text style={styles.infoLabel}>Đánh giá</Text>
                              <RatingDisplay
                                rating={ratingValue}
                                comment={schedule.comment || undefined}
                                maxRating={5}
                              />
                            </View>
                          </View>
                        )
                      );
                    })()}
                    {renderActionButton(schedule)}
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Surface>
      ))}
    </ScrollView>
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
    backgroundColor: colors.grey,
    padding: 12,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
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
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingContainer: {
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 8,
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
});
