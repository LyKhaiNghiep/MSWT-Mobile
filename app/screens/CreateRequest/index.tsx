import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {API_URLS} from '../../constants/api-urls';
import {TCreateRequest} from '../../hooks/useRequest';
import api from '../../services/api';
import {showSnackbar} from '../../utils/snackbar';

export default function CreateRequest() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<TCreateRequest>({
    location: '',
    description: '',
    requestDate: new Date(),
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.post(API_URLS.REQUEST.CREATE, reportData);

      if (response.data) {
        console.log('Report created successfully:', response.data);
        showSnackbar?.success('Tạo yêu cầu thành công');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating report:', error);
      showSnackbar?.error('Tạo yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen styles={{backgroundColor: 'white'}} useDefault>
      <AppHeader title="Tạo yêu cầu mới" navigateTo="Request" />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mô tả yêu cầu</Text>
          <TextInput
            style={styles.input}
            value={reportData.description}
            onChangeText={text =>
              setReportData(prev => ({...prev, description: text}))
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vị trí</Text>
          <TextInput
            style={styles.input}
            value={reportData.location}
            onChangeText={text =>
              setReportData(prev => ({...prev, location: text}))
            }
            multiline
            numberOfLines={4}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}>
          Tạo yêu cầu
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
