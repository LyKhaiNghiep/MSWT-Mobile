import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: colors.darkLabel,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  input: {
    marginTop: 8,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  submitButton: {
    backgroundColor: colors.mainColor,
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
