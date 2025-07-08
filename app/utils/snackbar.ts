import Snackbar from 'react-native-snackbar';

export const showSnackbar = {
  success: (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#4CAF50',
    });
  },
  error: (message: string, action?: () => void) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#F44336',
      action: action
        ? {
            text: 'THỬ LẠI',
            textColor: 'white',
            onPress: action,
          }
        : undefined,
    });
  },
  info: (message: string) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#2196F3',
    });
  },
};
