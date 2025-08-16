import auth from '@react-native-firebase/auth';

class OTPService {
  // Gửi mã OTP đến số điện thoại
  async sendOTP(phoneNumber: string): Promise<string> {
    console.log('số điện thoại', phoneNumber);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation.verificationId!;
    } catch (error) {
      console.error('Lỗi khi gửi mã OTP:', error);
      throw error;
    }
  }

  // Xác thực mã OTP
  async verifyOTP(verificationId: string, code: string): Promise<boolean> {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );
      await auth().signInWithCredential(credential);
      return true;
    } catch (error) {
      console.error('Lỗi khi xác thực mã OTP:', error);
      throw error;
    }
  }

  // Đăng xuất người dùng
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      throw error;
    }
  }

  // Lấy thông tin người dùng hiện tại
  getCurrentUser() {
    return auth().currentUser;
  }

  // Kiểm tra trạng thái xác thực
  onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }
}

export const otpService = new OTPService();
