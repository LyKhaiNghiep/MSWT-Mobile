import React from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {useRoute} from '@react-navigation/native';
import {Text, Card, Badge} from 'react-native-paper';
import {colors} from '../../theme';
import {format} from 'date-fns';
import {useReports} from '../../hooks/useReport';

export default function WorkerReportDetails() {
  const route = useRoute();
  const {reports} = useReports();
  const reportId = (route.params as any).reportId;
  const report = reports?.find(r => r.reportId === reportId);

  if (!report) return null;

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Chi tiết báo cáo" navigateTo="Report" />
      <ScrollView style={styles.container}>
        {report.imageUrl && (
          <Image
            source={{uri: report.imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge">{report.title}</Text>
              <Badge
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      report.status === 'Đã gửi' ? colors.blueDark : '#ff0000',
                  },
                ]}>
                {report.status}
              </Badge>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Ngày tạo:</Text>
              {report.createdDate ? (
                <Text variant="bodyLarge">
                  {format(new Date(report.createdDate), 'dd/MM/yyyy')}
                </Text>
              ) : (
                <Text variant="bodyLarge">N/A</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Loại báo cáo:</Text>
              <Text variant="bodyLarge">{report.reportType}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Mức độ ưu tiên:</Text>
              <Text variant="bodyLarge">{report.priority}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Vị trí:</Text>
              <Text variant="bodyLarge">{report.location}</Text>
            </View>

            <View style={styles.description}>
              <Text variant="labelLarge">Mô tả:</Text>
              <Text variant="bodyLarge" style={styles.descriptionText}>
                {report.description}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  description: {
    marginTop: 16,
  },
  descriptionText: {
    marginTop: 8,
    lineHeight: 24,
  },
});
