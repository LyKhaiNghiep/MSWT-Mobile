import React from 'react';
import {IScroll} from '../../../utils';

type IOnboardingCarousel = {
  carouselIndex: (index: IScroll) => void;
  carouselRef: (ref: React.MutableRefObject<undefined>) => void;
};

export const OnboardingCarousel = ({}: IOnboardingCarousel) => {
  return <></>;
};
