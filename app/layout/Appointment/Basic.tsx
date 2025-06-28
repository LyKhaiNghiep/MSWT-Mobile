import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Box,
  DateRangeInfo,
  Dismiss,
  RadioButtons,
  Text,
} from '../../components';
import {InputField} from '../../components/Form';
import {Header} from '../../components/Verification';
import {localStore} from '../../data';
import {StackNavigation} from '../../navigators';

export const Basic = () => {
  const navigation = useNavigation<StackNavigation>();
  const {fee, addFee, dateRange} = localStore();
  const {control, watch, getValues} = useForm<{fee: string}>({
    defaultValues: {fee},
  });
  useEffect(() => {
    if (getValues('fee')) {
      addFee(getValues('fee'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('fee')]);

  return (
    <>
      <Dismiss />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Box mt="ll">
          <Header addDefault={false} title="Basic Info" summary=" " />
          <Controller
            control={control}
            name="fee"
            rules={{
              required: true,
            }}
            render={({field: {onChange, value}}) => (
              <InputField
                value={value}
                onChange={onChange}
                label="Fee"
                keyboardType="numeric"
              />
            )}
          />

          <Box mt="l">
            <Text color="formLabel" variant="medium">
              Date Range
            </Text>
            {dateRange && <DateRangeInfo />}
            <RadioButtons
              onCustomPress={() => navigation.navigate('CustomDateRange')}
              title={[
                'Weekdays Only',
                'Weekends Only',
                'Entire Week',
                'Custom Range',
              ]}
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </>
  );
};
