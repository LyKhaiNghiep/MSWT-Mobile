import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';
import {APPOINTMENTSlices, createAppointmentSlices} from './appointment';
import {createStepsSlices, STEPSlices} from './step';
import {createUserSlices, UserSlices} from './user';

export const storage = new MMKV();
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export type StoreState = UserSlices & STEPSlices & APPOINTMENTSlices;

export const localStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createStepsSlices(...args),
      ...createUserSlices(...args),
      ...createAppointmentSlices(...args),
    }),

    {
      name: 'wellbeing_Doctor',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
