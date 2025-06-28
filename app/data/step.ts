import {StateCreator} from 'zustand';

export type STEPSlices = {
  personalInformationStep: boolean;
  addPersonalInformationStep: (personalInformationStep: boolean) => void;

  specialtyStep: boolean;
  addSpecialtyStep: (specialtyStep: boolean) => void;

  identityStep: boolean;
  addIdentityStep: (identityStep: boolean) => void;
};

export const createStepsSlices: StateCreator<STEPSlices> = set => ({
  personalInformationStep: false,
  specialtyStep: false,
  identityStep: false,

  addPersonalInformationStep: personal =>
    set(_ => ({personalInformationStep: personal})),
  addSpecialtyStep: specialty => set(_ => ({specialtyStep: specialty})),
  addIdentityStep: identity => set(_ => ({identityStep: identity})),
});
