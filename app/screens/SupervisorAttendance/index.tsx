import React, {useState, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Text,
  Card,
  Surface,
  ActivityIndicator,
  IconButton,
  Avatar,
  Badge,
  Searchbar,
  Button,
  Checkbox,
  Dialog,
  Portal,
  RadioButton,
  Provider,
} from 'react-native-paper';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import {Screen} from '../../components';
import {AppHeader} from '../../components/AppHeader';
import {colors} from '../../theme';
import {useAttendanceEmployees, EmployeeAttendance} from '../../hooks/useAttendanceEmployees';
// import {mockEmployeesData} from './mockData'; // Uncomment for testing

const ATTENDANCE_STATUS_CONFIG = {
  'Present': {
    label: 'Có mặt',
    color: colors.success,
    icon: 'check-circle',
  },
  'Absent': {
    label: 'Vắng mặt',
    color: colors.error,
    icon: 'close-circle',
  },
  'Late': {
    label: 'Đi muộn',
    color: colors.warning,
    icon: 'clock-alert',
  },
  'Not Checked In': {
    label: 'Chưa điểm danh',
    color: colors.grey,
    icon: 'clock-outline',
  },
};

export default function SupervisorAttendance() {
  const {employees, isLoading, saveAttendance} = useAttendanceEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState('1');
  const [isSaving, setIsSaving] = useState(false);

  // Debug logging
  React.useEffect(() => {
    if (employees && employees.length > 0) {
      console.log('👥 Employees data:', employees);
      console.log('📊 Sample employee:', employees[0]);
    }
  }, [employees]);

  // Hàm toggle chọn nhân viên
  const toggleEmployeeSelection = (userId: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedEmployees(newSelected);
  };

  // Hàm chọn tất cả/bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.userId)));
    }
  };

  // Hàm lưu điểm danh
  const handleSaveAttendance = async () => {
    if (selectedEmployees.size === 0) {
      alert('Vui lòng chọn ít nhất một nhân viên');
      return;
    }

    setIsSaving(true);
    try {
      await saveAttendance(Array.from(selectedEmployees), selectedShift);
      alert('Lưu điểm danh thành công!');
      setSelectedEmployees(new Set());
      setIsDialogVisible(false);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu điểm danh');
      console.error('Save attendance error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Chỉ lọc theo search query
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    // Lọc theo search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(employee => 
        (employee.fullName?.toLowerCase() || '').includes(query) ||
        (employee.email?.toLowerCase() || '').includes(query) ||
        (employee.phone || '').includes(query) ||
        (employee.position?.toLowerCase() || '').includes(query)
      );
    }

    return filtered;
  }, [employees, searchQuery]);

  const renderEmployeeCard = ({item}: {item: EmployeeAttendance}) => {
    // Fallback to default status if attendanceStatus is not recognized
    const statusConfig = ATTENDANCE_STATUS_CONFIG[item.attendanceStatus] || ATTENDANCE_STATUS_CONFIG['Not Checked In'];
    const isSelected = selectedEmployees.has(item.userId);
    
    return (
      <Surface style={styles.surface} elevation={2}>
        <Card style={styles.card} mode="outlined">
          <Card.Content style={styles.cardContent}>
            <Checkbox
              status={isSelected ? 'checked' : 'unchecked'}
              onPress={() => toggleEmployeeSelection(item.userId)}
              color={colors.primary}
            />
            <View style={styles.employeeMainInfo}>
              <View style={styles.employeeInfo}>
                {item.image ? (
                  <Avatar.Image 
                    size={50} 
                    source={{uri: item.image}}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text 
                    size={50} 
                    label={item.fullName?.charAt(0)?.toUpperCase() || '?'}
                    style={styles.avatar}
                  />
                )}
                <View style={styles.employeeDetails}>
                  <Text variant="titleMedium" style={styles.employeeName}>
                    {item.fullName || 'N/A'}
                  </Text>
                  <Text variant="bodySmall" style={styles.employeePosition}>
                    {item.position || 'N/A'}
                  </Text>
                  <Text variant="bodySmall" style={styles.employeeContact}>
                    {item.phone || 'N/A'} • {item.email || 'N/A'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.attendanceInfo}>
                <Badge 
                  style={[styles.statusBadge, {backgroundColor: statusConfig.color}]}
                  size={24}
                >
                  {statusConfig.label}
                </Badge>
                
                {item.checkInTime && (
                  <View style={styles.timeInfo}>
                    <View style={styles.timeRow}>
                      <IconButton
                        icon="login"
                        size={16}
                        iconColor={colors.success}
                        style={styles.timeIcon}
                      />
                      <Text variant="bodySmall" style={styles.timeText}>
                        Vào: {format(new Date(item.checkInTime), 'HH:mm', {locale: vi})}
                      </Text>
                    </View>
                    
                    {item.checkOutTime && (
                      <View style={styles.timeRow}>
                        <IconButton
                          icon="logout"
                          size={16}
                          iconColor={colors.error}
                          style={styles.timeIcon}
                        />
                        <Text variant="bodySmall" style={styles.timeText}>
                          Ra: {format(new Date(item.checkOutTime), 'HH:mm', {locale: vi})}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </Surface>
    );
  };





  if (isLoading) {
    return (
      <Screen styles={{backgroundColor: colors.grey}} useDefault>
        <AppHeader title="Điểm danh nhân viên" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </Screen>
    );
  }

      return (
      <Provider>
        <Screen styles={{backgroundColor: colors.grey}} useDefault>
          <AppHeader title="Điểm danh nhân viên" />
          
          <View style={styles.container}>
          {/* Header with select all and count */}
          <View style={styles.headerRow}>
            <View style={styles.selectAllRow}>
              <Checkbox
                status={
                  selectedEmployees.size === 0 
                    ? 'unchecked' 
                    : selectedEmployees.size === filteredEmployees.length 
                    ? 'checked' 
                    : 'indeterminate'
                }
                onPress={toggleSelectAll}
                color={colors.primary}
              />
              <Text variant="bodyMedium" style={styles.selectAllText}>
                Chọn tất cả ({selectedEmployees.size}/{filteredEmployees.length})
              </Text>
            </View>
            
            {selectedEmployees.size > 0 && (
              <Button
                mode="contained"
                onPress={() => setIsDialogVisible(true)}
                style={styles.saveButton}
                icon="content-save"
              >
                Lưu điểm danh
              </Button>
            )}
          </View>

          <Searchbar
            placeholder="Tìm kiếm nhân viên..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={colors.primary}
          />
          
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeCard}
            keyExtractor={item => item.userId}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <IconButton 
                  icon="account-search" 
                  size={48} 
                  iconColor={colors.grey}
                />
                <Text style={styles.emptyText}>
                  {searchQuery.trim() 
                    ? 'Không tìm thấy nhân viên nào'
                    : 'Chưa có dữ liệu điểm danh'
                  }
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
          />
        </View>

        {/* Dialog chọn ca làm việc */}
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>Chọn ca làm việc</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium" style={styles.dialogText}>
                Điểm danh cho {selectedEmployees.size} nhân viên đã chọn
              </Text>
              
              <View style={styles.shiftOptions}>
                <View style={styles.shiftOption}>
                  <RadioButton
                    value="1"
                    status={selectedShift === '1' ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedShift('1')}
                    color={colors.primary}
                  />
                  <Text variant="bodyMedium">Ca 1 (6:00 - 14:00)</Text>
                </View>
                
                <View style={styles.shiftOption}>
                  <RadioButton
                    value="2"
                    status={selectedShift === '2' ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedShift('2')}
                    color={colors.primary}
                  />
                  <Text variant="bodyMedium">Ca 2 (14:00 - 22:00)</Text>
                </View>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>Hủy</Button>
              <Button 
                onPress={handleSaveAttendance}
                loading={isSaving}
                disabled={isSaving}
                mode="contained"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu điểm danh'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </Screen>
      </Provider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.subLabel,
  },

  headerRow: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  searchbar: {
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  dialogText: {
    marginBottom: 16,
    color: colors.subLabel,
  },
  shiftOptions: {
    marginVertical: 8,
  },
  shiftOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  surface: {
    borderRadius: 12,
    backgroundColor: colors.white,
    marginHorizontal: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: colors.grey + '30',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  employeeMainInfo: {
    flex: 1,
    marginLeft: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  employeeName: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  employeePosition: {
    color: colors.subLabel,
    marginBottom: 2,
  },
  employeeContact: {
    color: colors.subLabel,
    fontSize: 12,
  },
  attendanceInfo: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    marginBottom: 8,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  timeIcon: {
    margin: 0,
    padding: 0,
  },
  timeText: {
    color: colors.subLabel,
    marginLeft: 4,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.subLabel,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});
