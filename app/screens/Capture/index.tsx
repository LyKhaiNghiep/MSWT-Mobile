import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {CameraButton} from '../../components';
import {localStore} from '../../data';
import {AppStackParamList, StackNavigation} from '../../navigators';

export const Capture = () => {
  const navigation = useNavigation<StackNavigation>();
  const {params} = useRoute<RouteProp<AppStackParamList, 'Capture'>>();
  const {addSelfie, addQualification} = localStore();
  const [capture, setCapture] = useState<boolean>();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice(params?.type === 'SELFIE' ? 'front' : 'back');
  const {hasPermission, requestPermission} = useCameraPermission();

  const snap = async () => {
    const file = await camera?.current?.takePhoto();
    setCapture(true);
    if (params.type === 'ID') {
      addQualification(file?.path!);
    } else {
      addSelfie(file?.path!);
    }
  };
  useEffect(() => {
    if (capture) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capture]);

  if (!hasPermission) {
    requestPermission();
  }

  return (
    <>
      <Camera
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1}}
        isActive
        ref={camera}
        photo={true}
        // @ts-ignore
        device={device}
      />
      <CameraButton onPress={snap} />
    </>
  );
};
