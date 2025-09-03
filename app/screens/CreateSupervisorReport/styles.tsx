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
    color: colors.dark,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  priorityChipForm: {
    borderWidth: 1,
    borderColor: colors.subLabel,
    backgroundColor: colors.white,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
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
  },
});
