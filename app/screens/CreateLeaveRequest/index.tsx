import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, Alert} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Button, SegmentedButtons, TextInput, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import {colors} from '../../theme';
import {API_URLS} from '../../constants/api-urls';
import {swrFetcher} from '../../utils/swr-fetcher';
import {LeaveRequestData} from '../../config/models/leave.model';
import {styles} from './styles';

export default function CreateLeaveRequest() {
  const navigation = useNavigation();
  const [leaveType, setLeaveType] = useState('1');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!reason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do xin nghỉ');
      return;
    }

    if (startDate > endDate) {
      Alert.alert('Lỗi', 'Ngày bắt đầu không thể sau ngày kết thúc');
      return;
    }

    setIsSubmitting(true);
    try {
      const leaveData: LeaveRequestData = {
        leaveType: parseInt(leaveType, 10),
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        reason: reason.trim(),
      };

      console.log('Sending leave data:', leaveData);

      // Sử dụng swrFetcher để có authentication tự động
      await swrFetcher(API_URLS.LEAVE_REQUEST.CREATE, {
        method: 'POST',
        body: JSON.stringify(leaveData),
      });

      Alert.alert('Thành công', 'Tạo đơn xin nghỉ thành công', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Submit error:', error);

      let errorMessage = 'Có lỗi xảy ra khi tạo đơn xin nghỉ';
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case '1':
        return 'Nghỉ phép năm';
      case '2':
        return 'Nghỉ bệnh';
      case '3':
        return 'Nghỉ việc riêng';
      default:
        return 'Không xác định';
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Tạo đơn xin nghỉ" navigateTo="LeaveRequest" />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Loại nghỉ phép</Text>
        <SegmentedButtons
          value={leaveType}
          onValueChange={setLeaveType}
          buttons={[
            {value: '1', label: 'Nghỉ phép năm'},
            {value: '2', label: 'Nghỉ bệnh'},
            {value: '3', label: 'Nghỉ việc riêng'},
          ]}
          style={styles.segmentedButtons}
        />

        <Text style={styles.sectionTitle}>Thời gian nghỉ</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          label="Ngày bắt đầu"
          value={format(startDate, 'dd/MM/yyyy')}
          onPressIn={() => setShowStartPicker(true)}
          editable={false}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => setShowStartPicker(true)}
            />
          }
        />

        <TextInput
          mode="outlined"
          style={styles.input}
          label="Ngày kết thúc"
          value={format(endDate, 'dd/MM/yyyy')}
          onPressIn={() => setShowEndPicker(true)}
          editable={false}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => setShowEndPicker(true)}
            />
          }
        />

        <Text style={styles.sectionTitle}>Lý do xin nghỉ</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          label="Lý do (bắt buộc)"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          placeholder="Nhập lý do xin nghỉ..."
        />

        <DatePicker
          modal
          open={showStartPicker}
          date={startDate}
          mode="date"
          title="Chọn ngày bắt đầu"
          confirmText="Chọn"
          cancelText="Hủy"
          onConfirm={date => {
            setShowStartPicker(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setShowStartPicker(false);
          }}
        />

        <DatePicker
          modal
          open={showEndPicker}
          date={endDate}
          mode="date"
          title="Chọn ngày kết thúc"
          confirmText="Chọn"
          cancelText="Hủy"
          onConfirm={date => {
            setShowEndPicker(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setShowEndPicker(false);
          }}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo đơn'}
          </Button>
          <Button
            mode="outlined"
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}>
            Hủy
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
