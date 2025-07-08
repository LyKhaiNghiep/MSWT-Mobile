import {useState} from 'react';
import {localStore} from '../data';

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
  const [data, setData] = useState<any[]>([]);

  const verification = async (qualification: string, selfie: string) => {
    if (UID) {
    }
  };

  const updateDoctorSchedule = async () => {};

  const appointmentTiming = async (appointmentDate: string) => {};

  const getUser = async (userID: string) => {
    return {};
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
