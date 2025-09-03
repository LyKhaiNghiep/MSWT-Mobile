import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, TextInput, SegmentedButtons, Text} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {CreateReportData, PRIORITY_MAPPING} from '../../hooks/useReport';
import {API_URLS} from '../../constants/api-urls';
import {useNavigation} from '@react-navigation/native';
import api from '../../services/api';
import {showSnackbar} from '../../utils/snackbar';

export default function CreateReport() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<CreateReportData>({
    reportName: '',
    description: '',
    priority: 2, // Default to Medium priority
  });

  const handleSubmit = async () => {
    // Basic validations: title and description are required
    if (!reportData.reportName.trim()) {
      showSnackbar?.error('Vui lòng nhập tiêu đề báo cáo');
      return;
    }

    if (!reportData.description.trim()) {
      showSnackbar?.error('Vui lòng nhập mô tả');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(API_URLS.REPORT.CREATE, reportData);

      if (response.data) {
        console.log('Report created successfully:', response.data);
        showSnackbar?.success('Tạo báo cáo thành công');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating report:', error);
      showSnackbar?.error('Tạo báo cáo thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Tạo báo cáo mới" navigateTo="WorkerReport" />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tiêu đề báo cáo</Text>
          <TextInput
            style={styles.input}
            value={reportData.reportName}
            onChangeText={text =>
              setReportData(prev => ({...prev, reportName: text}))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={styles.input}
            value={reportData.description}
            onChangeText={text =>
              setReportData(prev => ({...prev, description: text}))
            }
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.priorityContainer}>
          <SegmentedButtons
            value={reportData.priority.toString()}
            onValueChange={value =>
              setReportData(prev => ({...prev, priority: Number(value)}))
            }
            buttons={[
              {value: '1', label: 'Thấp'},
              {value: '2', label: 'Trung bình'},
              {value: '3', label: 'Cao'},
            ]}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={
            loading ||
            !reportData.reportName.trim() ||
            !reportData.description.trim()
          }
          style={styles.submitButton}>
          Tạo báo cáo
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 25,
  },

  priorityContainer: {},
  submitButton: {},
});
