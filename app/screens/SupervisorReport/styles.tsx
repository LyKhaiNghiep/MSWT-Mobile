import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    backgroundColor: colors.mainColor,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.grey,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  separator: {
    height: 12,
  },
  surfaceContainer: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 0,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  reportName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  createdBy: {
    color: colors.primary,
    marginBottom: 2,
  },
  createdDate: {
    color: colors.subLabel,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityChip: {
    height: 28,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 12,
  },
  description: {
    color: colors.darkLabel,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeChip: {
    height: 32,
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  chevronIcon: {
    margin: 0,
  },
  emptyText: {
    color: colors.subLabel,
    fontSize: 16,
    textAlign: 'center',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
});
