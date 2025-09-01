import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grey,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    backgroundColor: colors.grey,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scheduleCount: {
    backgroundColor: colors.primary,
  },
  scheduleCard: {
    margin: 8,
    marginBottom: 8,
    elevation: 1,
  },
  cardContent: {
    padding: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  dayChip: {
    height: 24,
  },
  dayChipText: {
    fontSize: 12,
    color: colors.white,
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 12,
    color: colors.white,
  },
  divider: {
    marginVertical: 8,
  },
  scheduleInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
    textAlign: 'right',
  },
}); 