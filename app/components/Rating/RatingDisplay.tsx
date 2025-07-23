import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {colors} from '../../theme';

interface RatingDisplayProps {
  rating: number;
  comment?: string;
  maxRating?: number;
}

export const RatingDisplay = ({
  rating,
  comment,
  maxRating = 5,
}: RatingDisplayProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Đánh giá:</Text>
        <View style={styles.starsContainer}>
          {Array.from({length: maxRating}).map((_, index) => (
            <IconButton
              key={index}
              icon="star"
              size={16}
              iconColor={index < rating ? colors.warning : colors.grey}
              style={styles.star}
              disabled
            />
          ))}
          <Text style={styles.ratingText}>({rating}/5)</Text>
        </View>
      </View>
      {comment && (
        <View style={styles.commentContainer}>
          <Text style={styles.commentLabel}>Nhận xét:</Text>
          <Text style={styles.commentText}>{comment}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary2,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    color: colors.grey,
    fontSize: 14,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    margin: 0,
  },
  ratingText: {
    color: colors.warning,
    fontSize: 14,
    marginLeft: 4,
  },
  commentContainer: {
    marginTop: 8,
  },
  commentLabel: {
    color: colors.grey,
    fontSize: 14,
    marginBottom: 4,
  },
  commentText: {
    color: colors.primary,
    fontSize: 14,
  },
}); 