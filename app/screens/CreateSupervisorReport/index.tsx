import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {colors} from '../../theme';
import {styles} from './styles';
import {BASE_API_URL} from '../../constants/api-urls';

const REPORT_TYPES = [
  {value: '1', label: 'Báo cáo sự cố'},
  {value: '2', label: 'Báo cáo nhân viên'},
];

const PRIORITY_OPTIONS = [
  {value: 1, label: 'Thấp', color: colors.success},
  {value: 2, label: 'Trung bình', color: colors.warning},
  {value: 3, label: 'Cao', color: colors.error},
];

interface CreateSupervisorReportProps {
  navigation: any;
}

export default function CreateSupervisorReport({navigation}: CreateSupervisorReportProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    reportName: '',
    description: '',
    priority: 1, // Thay đổi từ 2 (Trung bình) thành 1 (Thấp)
    reportType: 1,
  });

  // Debug log khi formData thay đổi
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  const handleInputChange = (field: string, value: string | number) => {
    console.log(`Updating ${field}:`, value); // Debug log
    setFormData(prev => {
      const newData = {...prev, [field]: value};
      console.log('New form data:', newData); // Debug log
      return newData;
    });
  };

  const handleSubmit = async () => {
    console.log('Form data before submit:', formData); // Debug log
    
    if (!formData.reportName.trim() || !formData.description.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const reportData = {
        reportName: formData.reportName.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        reportType: formData.reportType,
      };

      console.log('Sending data:', reportData); // Debug log

      // Sử dụng API riêng cho supervisor
      const response = await fetch(`${BASE_API_URL}/reports/leader-supervisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Báo cáo đã được tạo thành công', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Không thể tạo báo cáo');
      }
    } catch (error) {
      console.error('Submit error:', error); // Debug log
      Alert.alert('Lỗi', error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.reportName.trim() || formData.description.trim()) {
      Alert.alert(
        'Xác nhận hủy',
        'Bạn có chắc chắn muốn hủy? Dữ liệu đã nhập sẽ bị mất.',
        [
          {text: 'Tiếp tục chỉnh sửa', style: 'cancel'},
          {
            text: 'Hủy',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <Screen styles={{backgroundColor: colors.grey}} useDefault>
      <AppHeader 
        title="Tạo báo cáo mới" 
        onBackPress={handleCancel}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 32}}>
          
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Thông tin báo cáo
          </Text>

          <TextInput
            label="Tên báo cáo *"
            value={formData.reportName}
            onChangeText={value => handleInputChange('reportName', value)}
            mode="outlined"
            style={styles.input}
            maxLength={100}
            placeholder="Nhập tên báo cáo"
            textColor={colors.dark}
            placeholderTextColor={colors.subLabel}
          />

          <TextInput
            label="Mô tả *"
            value={formData.description}
            onChangeText={value => handleInputChange('description', value)}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            maxLength={500}
            placeholder="Mô tả chi tiết về báo cáo"
            textColor={colors.dark}
            placeholderTextColor={colors.subLabel}
          />



          <Text variant="bodyMedium" style={styles.label}>
            Loại báo cáo
          </Text>
          <SegmentedButtons
            value={formData.reportType.toString()}
            onValueChange={value => handleInputChange('reportType', parseInt(value))}
            buttons={REPORT_TYPES}
            style={styles.segmentedButtons}
          />

          <Text variant="bodyMedium" style={styles.label}>
            Mức độ ưu tiên
          </Text>
          <View style={styles.priorityContainer}>
            {PRIORITY_OPTIONS.map(option => (
              <View
                key={option.value}
                style={[
                  styles.priorityChipForm,
                  formData.priority === option.value && {
                    backgroundColor: option.color + '20',
                    borderColor: option.color,
                  },
                ]}
                onTouchEnd={() => handleInputChange('priority', option.value)}>
                <Text
                  style={[
                    styles.priorityChipText,
                    formData.priority === option.value && {color: option.color},
                  ]}>
                  {option.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
              disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={isSubmitting}
              disabled={isSubmitting}>
              Tạo báo cáo
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
