import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Card,
  Text,
  ProgressBar,
  Surface,
  IconButton,
  MD3Colors,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useDashboard} from '../../hooks/useDashboard';
import {colors} from '../../theme';
import {format} from 'date-fns';

export default function WorkerDashboard() {
  const {workStatus, daysOff, averageRating, isLoading, hasError} =
    useDashboard();

  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Tổng quan" />
        <Surface style={styles.loadingContainer} elevation={1}>
          <ProgressBar indeterminate color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </Surface>
      </Screen>
    );
  }

  if (hasError) {
    return (
      <Screen styles={{backgroundColor: 'white'}} useDefault>
        <AppHeader title="Tổng quan" />
        <Surface style={styles.errorContainer} elevation={1}>
          <IconButton icon="alert-circle" size={48} iconColor={colors.error} />
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorText}>
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </Text>
        </Surface>
      </Screen>
    );
  }

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Tổng quan" />
      <ScrollView style={styles.container}>
        {/* Work Status Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <IconButton
                icon="clock-outline"
                size={24}
                iconColor={colors.primary}
                style={styles.headerIcon}
              />
              <Text variant="titleMedium">
                Thống kê công việc tháng {workStatus?.month} /{' '}
                {workStatus?.year}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={(workStatus?.percentage ?? 0) / 100}
                color={MD3Colors.error50}
              />
              <Text variant="bodyLarge" style={styles.progressText}>
                {workStatus?.workedDays}/{workStatus?.totalDays} ngày
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Rating Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <IconButton
                icon="star-outline"
                size={24}
                iconColor={colors.warning}
                style={styles.headerIcon}
              />
              <Text variant="titleMedium">Đánh giá trung bình</Text>
            </View>
            <View style={styles.ratingContainer}>
              <IconButton
                icon="star"
                size={32}
                iconColor={colors.warning}
                style={styles.starIcon}
              />
              <Text variant="headlineMedium" style={styles.ratingText}>
                {(averageRating ?? 0)?.toFixed(1)}/5
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Days Off Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <IconButton
                icon="calendar-blank"
                size={24}
                iconColor={colors.primary}
                style={styles.headerIcon}
              />
              <Text variant="titleMedium">Ngày nghỉ sắp tới</Text>
            </View>
            <View style={styles.daysOffContainer}>
              {daysOff?.data.map((date, index) => (
                <Surface key={index} style={styles.dateChip} elevation={2}>
                  <IconButton
                    icon="calendar"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.dateIcon}
                  />
                  <Text variant="bodyMedium" style={styles.dateText}>
                    {format(new Date(date), 'dd/MM/yyyy')}
                  </Text>
                </Surface>
              ))}
              {(!daysOff?.data || daysOff.data.length === 0) && (
                <Text variant="bodyMedium" style={styles.noDataText}>
                  Không có ngày nghỉ nào sắp tới
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    margin: 0,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#fff9e6',
    padding: 16,
    borderRadius: 8,
  },
  starIcon: {
    margin: 0,
    backgroundColor: '#fff3d4',
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 12,
    color: colors.warning,
    fontWeight: '700',
  },
  daysOffContainer: {
    marginTop: 16,
    gap: 8,
  },
  dateChip: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#e8f4ff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dateIcon: {
    margin: 0,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dateText: {
    color: colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  noDataText: {
    textAlign: 'center',
    color: colors.subLabel,
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff1f0',
    margin: 16,
    borderRadius: 12,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: colors.error,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.subLabel,
    lineHeight: 20,
  },
});
