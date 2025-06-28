import {CountryCode} from 'react-native-country-picker-modal';
import {StateCreator} from 'zustand';

type GENDER_TYPE = 'Male' | 'Female';
export type COUNTRY = {
  name?: string;
  code?: CountryCode;
};
export type UserSlices = {
  UID: string;
  addUID: (id: string) => void;
  fullName: string;
  addFullName: (name: string) => void;
  gender: 'Male' | 'Female' | '';
  addGender: (gender: GENDER_TYPE) => void;
  email: string;
  addEmail: (email: string) => void;
  bio: string;
  addBio: (bio: string) => void;
  country: COUNTRY;
  addCountry: (country: COUNTRY) => void;
  yoe: string;
  addYOE: (yoe: string) => void;
  dob: Date;
  addDOB: (dob: Date) => void;
  specialty: string;
  addSpecialty: (specialty: string) => void;
  selfie: string;
  addSelfie: (path: string) => void;
  qualification: string;
  addQualification: (qualification: string) => void;
  verificationStatus: string;
  addVerificationStatus: (verificationStatus: string) => void;
  verified: boolean;
  addVerified: (verified: boolean) => void;
};

export const createUserSlices: StateCreator<UserSlices> = set => ({
  UID: '',
  gender: '',
  fullName: '',
  bio: '',
  email: '',
  dob: new Date(''),
  specialty: '',
  selfie: '',
  qualification: '',
  verificationStatus: 'not_started',
  verified: false,
  country: {code: undefined, name: ''},
  yoe: '',
  addFullName: fullName => set(_ => ({fullName: fullName})),
  addGender: gender => set(_ => ({gender: gender})),
  addEmail: email => set(_ => ({email: email})),
  addBio: bio => set(_ => ({bio: bio})),
  addCountry: country => set(_ => ({country: country})),
  addYOE: yoe => set(_ => ({yoe: yoe})),
  addSpecialty: specialty => set(_ => ({specialty: specialty})),
  addUID: id => set(_ => ({UID: id})),
  addSelfie: selfie => set(_ => ({selfie: selfie})),
  addQualification: qualification => set(_ => ({qualification: qualification})),
  addDOB: dob => set(_ => ({dob: dob})),
  addVerificationStatus: status => set(_ => ({verificationStatus: status})),
  addVerified: verified => set(_ => ({verified: verified})),
});
