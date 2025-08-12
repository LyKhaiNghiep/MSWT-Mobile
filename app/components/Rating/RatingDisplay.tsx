import React from 'react';
import {View, StyleSheet, Text as RNText} from 'react-native';
import {Text} from 'react-native-paper';
import {colors} from '../../theme';

interface RatingDisplayProps {
  rating: number | string;
  comment?: string;
  maxRating?: number;
}

export const RatingDisplay = ({rating, comment, maxRating = 5}: RatingDisplayProps) => {
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
    <View style={styles.container}>
      {/* Rating Stars */}
      <View style={styles.starsContainer}>
        {Array.from({length: maxRating}).map((_, index) => {
          const isFilled = index < ratingValue;
          const starColor = isFilled ? colors.warning : colors.subLabel;

          return (
            <RNText key={index} style={[styles.starText, {color: starColor}]}>
              {isFilled ? '★' : '☆'}
            </RNText>
          );
        })}
        <Text style={styles.ratingText}>({ratingValue}/5)</Text>
      </View>
      
      {/* Comment Display */}
      {comment && comment.trim() && (
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>{comment}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontSize: 18,
    marginHorizontal: 2,
    fontFamily: 'System',
  },
  ratingText: {
    color: colors.warning,
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'WorkSans-Regular',
  },
  commentContainer: {
    backgroundColor: colors.grey,
    padding: 8,
    borderRadius: 6,
  },
  commentText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 16,
    fontFamily: 'WorkSans-Regular',
  },
});
