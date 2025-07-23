import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useRoute} from '@react-navigation/native';
import {Text, Card, Badge, Surface, Divider, Avatar} from 'react-native-paper';
import {colors} from '../../theme';
import {format} from 'date-fns';
import {useReports} from '../../hooks/useReport';

export default function WorkerReportDetails() {
  const route = useRoute();
  const {reports} = useReports();
  const reportId = (route.params as any)?.reportId;
  const report = reports?.find(r => r.reportId === reportId);

  if (!report) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã gửi':
        return colors.success;
      case 'Đang xử lý':
        return colors.warning;
      default:
        return colors.error;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Thấp':
        return colors.success;
      case 'Trung bình':
      case 'Trung Bình':
        return colors.yellow;
      case 'Cao':
        return colors.error;
      default:
        return colors.subLabel;
    }
  };

  return (
    <Screen styles={{backgroundColor: colors.white}} useDefault>
      <AppHeader title="Chi tiết báo cáo" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Surface style={styles.surfaceContainer} elevation={2}>
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.cardContent}>
              <View style={styles.headerRow}>
                <Avatar.Icon size={56} icon="file-document-outline" style={styles.avatar} />
                <View style={styles.headerInfo}>
                  <Text variant="titleLarge" style={styles.reportName}>{report.reportName}</Text>
                  <Text style={styles.createdBy}>Bởi: {report.userName}</Text>
                  <Text style={styles.createdDate}>{report.createdAt ? format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Badge style={[styles.statusBadge, {backgroundColor: getStatusColor(report.status)}]} size={28}>{report.status}</Badge>
              </View>
              <View style={styles.priorityRow}>
                <View style={[styles.priorityChip, {borderColor: getPriorityColor(report.priority)}]}>
                  <Text style={[styles.priorityText, {color: getPriorityColor(report.priority)}]}>{report.priority}</Text>
                </View>
              </View>
              <View style={styles.typeRow}>
                <View style={styles.typeChip}>
                  <Text style={styles.typeText}>{report.reportType}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <Text style={styles.label}>Mô tả</Text>
              <Text style={styles.description}>{report.description || 'Không có mô tả'}</Text>
              {report.image && (
                <View style={styles.imageContainer}>
                  <Image source={{uri: report.image}} style={styles.image} resizeMode="cover" />
                </View>
              )}
            </Card.Content>
          </Card>
        </Surface>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  surfaceContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
  },
  cardContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: colors.secondary1Light,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  reportName: {
    fontWeight: 'bold',
    color: colors.darkLabel,
    fontSize: 18,
    marginBottom: 2,
  },
  createdBy: {
    color: colors.subLabel,
    fontSize: 13,
    marginBottom: 1,
  },
  createdDate: {
    color: colors.subLabel,
    fontSize: 13,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  statusBadge: {
    borderRadius: 6,
    marginRight: 10,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 48,
    textAlign: 'center',
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityChip: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.subLabel,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 10,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeChip: {
    backgroundColor: colors.secondary1Light,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 48,
  },
  typeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 12,
  },
  label: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
    fontSize: 15,
  },
  description: {
    fontSize: 15,
    color: colors.darkLabel,
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  image: {
    width: 220,
    height: 160,
    borderRadius: 10,
    backgroundColor: colors.secondary1Light,
  },
}); 