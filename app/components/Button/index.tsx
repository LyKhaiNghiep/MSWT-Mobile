import React, {ReactNode} from 'react';
import {Pressable} from 'react-native';
import {RectButtonProps} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// import {Skottie} from 'react-native-skottie';
import {Loader} from '../../assets/lottie';
import {colors} from '../../theme';
import {spacing} from '../../theme/spacing';
import {Box} from '../Box';
import {Text} from '../Text';
import {$button, $buttonContainer, $label, $skottie} from './styles';

type ButtonProps = RectButtonProps & {
  onPress?: () => void;
  label: string;
  leftIcon?: ReactNode;
  useSecondary?: boolean;

  isLoading?: boolean;
};
export const AnimatedButton = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  onPress,
  isLoading,
  leftIcon,
  useSecondary,
  label,
  ...props
}: ButtonProps) => {
  const scaleDown = useSharedValue<number>(1);

  const isButtonEnabled =
    props.enabled === undefined ? false : props.enabled ? false : true;

  const onPressIn = () => {
    scaleDown.value = 0.9;
  };
  const onPressOut = () => {
    scaleDown.value = 1;
  };
  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scaleDown.value, {duration: 250}),
        },
      ],

      opacity: isButtonEnabled
        ? withTiming(0.2, {duration: 250})
        : withTiming(scaleDown.value, {duration: 250}),

      borderRadius: spacing.borderRadius,
    };
  });
  return (
    <Box flex={1} style={$buttonContainer} overflow="hidden">
      <AnimatedButton
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...props}
        style={[
          $button,
          buttonStyle,
          useSecondary && {backgroundColor: colors.blueDark},
        ]}
        onPress={onPress}>
        {isLoading ? (
          // <Skottie
          //   style={$skottie}
          //   resizeMode="cover"
          //   source={Loader}
          //   autoPlay={true}
          //   loop={true}
          // />
          <></>
        ) : (
          <Box flexDirection="row" gap="n" alignItems="center">
            {leftIcon}

            <Text style={$label} variant="buttonLabel">
              {label}
            </Text>
          </Box>
        )}
      </AnimatedButton>
    </Box>
  );
};
