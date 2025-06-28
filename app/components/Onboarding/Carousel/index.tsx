import React, {useEffect, useRef} from 'react';
import {Dimensions} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useCarousel} from '../../../hooks';
import {colors} from '../../../theme';
import {carouselData, IScroll} from '../../../utils';
import {Box} from '../../Box';
import {Text} from '../../Text';
import {$container, $item, $labelContainer, $labelHeading} from './styles';
import { spacing } from '../../../theme/spacing';

type IOnboardingCarousel = {
  carouselIndex: (index: IScroll) => void;
  carouselRef: (
    ref: React.MutableRefObject<ICarouselInstance | undefined>,
  ) => void;
};

export const OnboardingCarousel = ({
  carouselIndex,
  carouselRef,
}: IOnboardingCarousel) => {
  const {width} = Dimensions.get('window');
  const {onSnapToItem, scrollIndex} = useCarousel();
  const {secondary1, secondary2, secondary3} = colors;
  const CAROUSEL_ITEM_BACKGROUND_COLOR = [secondary1, secondary2, secondary3];
  const carousel = useRef<any>();
  carouselRef(carousel);
  useEffect(() => {
    carouselIndex(scrollIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollIndex]);

  return (
    <>
      <Carousel
        ref={carousel}
        loop={false}
        autoPlayInterval={1500}
        width={width}
        style={$container}
        data={carouselData}
        pagingEnabled={true}
        onSnapToItem={onSnapToItem}
        renderItem={({index, item}) => (
          <Box key={index} flex={1} width={width} overflow="hidden">
            <Box
              borderRadius={spacing.borderRadius}
              justifyContent="center"
              style={[
                {backgroundColor: `${CAROUSEL_ITEM_BACKGROUND_COLOR[index]}`},
                $item,
              ]}
              alignItems="center"
              height="57%">
              {item.icon}
            </Box>

            <Box style={$labelContainer}>
              <Text textAlign="center" variant="mBold" style={$labelHeading}>
                {item.title}
              </Text>
              <Text paddingTop="xs" textAlign="center" variant="regular">
                {item.summary}
              </Text>
            </Box>
          </Box>
        )}
      />
    </>
  );
};
