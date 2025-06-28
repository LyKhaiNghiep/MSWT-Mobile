import React from 'react';
import {RectButton} from 'react-native-gesture-handler';
import {Loader} from '../../../assets/lottie';
import {Apple, Google} from '../../../assets/svgs';
import {Box} from '../../Box';
import {$buttonContainer} from '../../Button/styles';
import {Text} from '../../Text';
import {$border} from '../style';
import {$button, $skottie} from './style';
// import { Skottie } from 'react-native-skottie';

type SocialButton = {
  type: 'google' | 'apple';
  onPress?: () => void;
  isLoading?: boolean;
};
export const SocialButton = ({type, onPress, isLoading}: SocialButton) => {
  const title =
    type === 'google' ? 'Continue with Google' : 'Continue with Apple';
  return (
    <Box mb="xs" style={[$buttonContainer, $border]} overflow="hidden">
      <RectButton enabled={!isLoading} style={[$button]} onPress={onPress}>
        <Box flexDirection="row" alignItems="center">
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
            <>
              {type === 'google' ? <Google /> : <Apple />}
              <Text pl="n" variant="buttonLabel" color="primary">
                {title}
              </Text>
            </>
          )}
        </Box>
      </RectButton>
    </Box>
  );
};
