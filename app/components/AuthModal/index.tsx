import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {useMemo, useState} from 'react';
import {Box} from '../Box';

import {
  $bottomSheetContainer,
  $buttonGroup,
  $container,
  $indicator,
} from './style';

type AuthModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
};
export const AuthModal = ({bottomSheetModalRef}: AuthModalProps) => {
  const snapPoints = useMemo(() => ['1', '24%'], []);
  const [auth, setAuth] = useState<'google' | 'apple' | undefined>(undefined);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      backgroundStyle={$container}
      handleIndicatorStyle={$indicator}
      backdropComponent={BottomSheetBackdrop}
      snapPoints={snapPoints}>
      <BottomSheetView style={[$bottomSheetContainer]}>
        <Box
          pointerEvents={auth ? 'none' : 'auto'}
          justifyContent="center"
          gap="s"
          style={$buttonGroup}></Box>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
