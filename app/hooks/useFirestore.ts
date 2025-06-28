import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useState} from 'react';
import {localStore} from '../data';
import {APPOINTMENTS, USERS} from '../services';
import {delay, isDateValid} from '../utils';

export const useFirestore = () => {
  //REMOVE
  const [hasReceived, setHasReceived] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<boolean>();
  const {
    UID,
    bio,
    dob,
    fullName,
    gender,
    specialty,
    addVerificationStatus,
    fee,
    dateRange,
    country,
    yoe,
    customRange,
    workingHours,
  } = localStore();

  const countryName = country.name;
  const [data, setData] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

  const verification = async (qualification: string, selfie: string) => {
    if (UID) {
      const userCollection = await firestore().collection(USERS).doc(UID);
      userCollection
        .update({
          bio,
          dob,
          fullName,
          gender,
          countryName,
          yoe,
          qualification,
          selfie,
          specialty,
          verificationStatus: 'pending',
        })
        .then(() => {
          addVerificationStatus('pending');
          setHasReceived(true);
        })
        .catch(() => setError(true));
    }
  };

  const updateDoctorSchedule = async () => {
    const collection = await firestore().collection(USERS).doc(UID);
    const validHours = workingHours.filter(
      item => isDateValid(item.endTime) && isDateValid(item.startTime),
    );

    collection
      .update({
        fee,
        customRange,
        dateRange,
        workingHours: firestore.FieldValue.arrayUnion(...validHours),
      })
      .then(() => {
        setHasReceived(true);
      })
      .catch(() => setError(true));
  };

  const appointmentTiming = async (appointmentDate: string) => {
    try {
      const collection = await firestore()
        .collection(APPOINTMENTS)
        .where('doctorID', '==', UID)
        .where('appointmentDate', '==', appointmentDate)
        .get();

      const newData = collection.docs.map(doc => ({...doc.data()}));
      setData(newData);
      await delay(2500);
      setLoading(false);
    } catch (_) {
      setLoading(false);
      setError(true);
    }
  };

  const getUser = async (userID: string) => {
    const user = (await firestore().collection(USERS).doc(userID).get()).data();
    return user;
  };

  return {
    verification,
    hasReceived,
    loading,
    error,
    getUser,
    data,
    updateDoctorSchedule,
    appointmentTiming,
  };
};
