import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Pressable} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {ArrowBackAndroid, ArrowBackiOS, Cancel} from '../../assets/svgs';
import {StackNavigation} from '../../navigators';
import {isAndroid, moderateScale} from '../../utils';
import {Box} from '../Box';
import {Text} from '../Text';
import {$border, $button, $container, $widthHeightStyle} from './style';

type DismissProps = {
  wnh?: number;
  rightButtonLabel?: string;
  rightButtonOnPress?: () => void;
  title?: string;
  isModal?: boolean;
  modalOnPress?: () => void;
};
export const Dismiss = ({
  wnh,
  title,
  modalOnPress,
  isModal = false,
  rightButtonOnPress,
  rightButtonLabel,
}: DismissProps) => {
  const navigation = useNavigation<StackNavigation>();

  const onPress = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  return (
    <Box flexDirection="row" justifyContent="center" alignItems="center">
      <Box style={[$container, $widthHeightStyle(wnh), title && $border]}>
        <RectButton
          hitSlop={50}
          onPress={isModal ? modalOnPress : onPress}
          style={[$button, $widthHeightStyle(wnh)]}>
          {isModal ? (
            <Cancel />
          ) : !isAndroid ? (
            <ArrowBackiOS />
          ) : (
            <ArrowBackAndroid />
          )}
        </RectButton>
      </Box>

      <Box flex={1} alignItems="center">
        <Text variant="medium" fontSize={moderateScale(18)}>
          {title}
        </Text>
      </Box>

      <Box flex={0.513} hitSlop={20}>
        {rightButtonLabel && (
          <Pressable onPress={rightButtonOnPress}>
            <Text
              color="primary"
              variant="buttonLabel"
              fontSize={moderateScale(15)}>
              {rightButtonLabel}
            </Text>
          </Pressable>
        )}
      </Box>
    </Box>
  );
};
