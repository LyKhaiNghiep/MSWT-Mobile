import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontWeight: '600',
    marginBottom: 24,
    color: colors.dark,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  label: {
    fontWeight: '500',
    marginBottom: 12,
    color: colors.dark,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  priorityChipForm: {
    borderWidth: 1,
    borderColor: colors.subLabel,
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.subLabel,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
