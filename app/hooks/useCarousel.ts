import {useCallback, useState} from 'react';
import {IScroll, isRTL, SCROLL_DEFAULT} from '../utils';

export const useCarousel = () => {
  const [scrollIndex, setScrollIndex] = useState<IScroll>(SCROLL_DEFAULT);

  const onSnapToItem = useCallback((index: number) => {
    const rtlIndex =
      index === 1 ? 3 : index === 0 ? 4 : index === 3 ? 1 : index;
    const ii = isRTL ? rtlIndex : index + 1;

    setScrollIndex({
      index,
      value: Math.round(ii) * 33.33,
    });
  }, []);

  return {onSnapToItem, scrollIndex};
};
