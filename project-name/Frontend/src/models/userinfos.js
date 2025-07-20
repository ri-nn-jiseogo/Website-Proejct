// src/models/userinfos.js
import { atom } from 'recoil';

export const defaultUserState = {
    Id: undefined,
    email: undefined,
    firstname: undefined,
    lastname: undefined,
    grade: undefined,
    isstaff: undefined,
    tier: undefined,
    stats: { difficult: 0, moderate: 0, easy: 0 },
    challenges: 0,
  }
export const userState = atom({
  key: 'user',
  default: defaultUserState
});