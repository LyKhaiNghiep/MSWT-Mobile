import auth from '@react-native-firebase/auth';

class OTPService {
  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<string> {
    console.log('phoneNumber', phoneNumber);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return confirmation.verificationId;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  // Verify OTP code
  async verifyOTP(verificationId: string, code: string): Promise<boolean> {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );
      await auth().signInWithCredential(credential);
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Check authentication state
  onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }
}

export const otpService = new OTPService();
