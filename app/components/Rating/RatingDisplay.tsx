import React from 'react';
import {View, StyleSheet, Text as RNText} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from '../../theme';

interface RatingDisplayProps {
  rating: number | string;
  comment?: string;
  maxRating?: number;
}

export const RatingDisplay = ({rating, maxRating = 5}: RatingDisplayProps) => {
  // Parse rating từ string hoặc number
  const getRatingValue = (rating: number | string): number => {
    if (typeof rating === 'number') {
      return rating >= 1 && rating <= 5 ? rating : 0;
    }
    if (typeof rating === 'string') {
      const cleanRating = rating.replace(/[,\s]/g, '');
      const parsed = parseFloat(cleanRating);
      return parsed >= 1 && parsed <= 5 ? parsed : 0;
    }
    return 0;
  };

  const ratingValue = getRatingValue(rating);

  return (
    <View style={styles.starsContainer}>
      {Array.from({length: maxRating}).map((_, index) => {
        const isFilled = index < ratingValue;
        const starColor = isFilled ? '#FD995C' : '#CCCCCC';

        return (
          <RNText key={index} style={[styles.starText, {color: starColor}]}>
            {isFilled ? '★' : '☆'}
          </RNText>
        );
      })}
      <Text style={styles.ratingText}>({ratingValue}/5)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingLabel: {
    color: colors.grey,
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    margin: 0,
  },
  starText: {
    fontSize: 19,
    marginHorizontal: 3,
    fontFamily: 'System',
  },

  ratingText: {
    color: '#FD995C',
    fontSize: 16,
    marginLeft: 9,
    fontFamily: 'WorkSans-Regular',
  },
});
