import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {colors} from '../../theme';

interface RatingProps {
  value: number;
  onValueChange: (value: number) => void;
  size?: number;
  maxRating?: number;
}

export const Rating = ({
  value,
  onValueChange,
  size = 24,
  maxRating = 5,
}: RatingProps) => {
  return (
    <View style={styles.container}>
      {Array.from({length: maxRating}).map((_, index) => (
        <IconButton
          key={index}
          icon="star"
          size={size}
          iconColor={index < value ? colors.warning : colors.grey}
          onPress={() => onValueChange(index + 1)}
          style={styles.star}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    margin: 0,
  },
}); 