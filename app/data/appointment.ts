import {StateCreator} from 'zustand';
import {FormInfo} from '../utils';

export type APPOINTMENTSlices = {
  fee: string;
  addFee: (fee: string) => void;

  dateRange: string;
  addDateRange: (dateRange: string) => void;

  customRange: boolean;
  addCustomRange: (customRange: boolean) => void;

  workingHours: FormInfo[];
  addWorkingHours: (workingHours: FormInfo[]) => void;
};

export const createAppointmentSlices: StateCreator<
  APPOINTMENTSlices
> = set => ({
  fee: '',
  dateRange: '',
  customRange: false,
  workingHours: [],
  addFee: fee => set(_ => ({fee: fee})),
  addWorkingHours: hrs => set(_ => ({workingHours: hrs})),
  addDateRange: dateRange => set(_ => ({dateRange: dateRange})),
  addCustomRange: customRange => set(_ => ({customRange: customRange})),
});
