import { atom } from 'recoil';

//recoil state 생성
export const userState = atom({
    key: 'user',
    default: {
        Id: undefined,
        firstname: undefined,
        lastname: undefined,
        isstaff: undefined,
        level: undefined
    }
});