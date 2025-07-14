import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {Button, SegmentedButtons, TextInput} from 'react-native-paper';
import {showSnackbar} from '../../utils/snackbar';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {colors} from '../../theme';

export default function CreateLeaveRequest() {
  const navigation = useNavigation();
  const [leaveType, setLeaveType] = useState('1');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    try {
      // Add API call here to submit leave request
      const leaveData = {
        leaveType: parseInt(leaveType, 10),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reason,
      };

      console.log('Submit leave request:', leaveData);
      showSnackbar?.success('Tạo đơn xin nghỉ thành công');
      navigation.goBack();
    } catch (error) {
      showSnackbar?.error('Tạo đơn xin nghỉ thất bại');
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Tạo đơn xin nghỉ" navigateTo="LeaveRequest" />
      <ScrollView style={styles.container}>
        <SegmentedButtons
          value={leaveType}
          onValueChange={setLeaveType}
          buttons={[
            {value: '1', label: 'Nghỉ phép'},
            {value: '2', label: 'Nghỉ ốm'},
            {value: '3', label: 'Không lương'},
          ]}
        />

        <TextInput
          mode="outlined"
          style={styles.input}
          label="Ngày bắt đầu"
          value={format(startDate, 'dd/MM/yyyy')}
          onPressIn={() => setShowStartPicker(true)}
        />

        <TextInput
          mode="outlined"
          style={styles.input}
          label="Ngày kết thúc"
          value={format(endDate, 'dd/MM/yyyy')}
          onPressIn={() => setShowEndPicker(true)}
        />

        <TextInput
          mode="outlined"
          style={styles.input}
          label="Lý do"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
        />

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={{
              backgroundColor: colors.mainColor,
              flex: 1,
              marginHorizontal: 8,
            }}
            onPress={handleSubmit}>
            Tạo đơn
          </Button>
          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.goBack()}>
            Hủy
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
