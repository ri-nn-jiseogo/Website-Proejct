import { atom } from 'recoil';

//recoil state 생성
export const userState = atom({
    key: 'user',
    default: {
        Id: undefined,
        name: undefined,
        class: undefined,
        dob: undefined,
        school: undefined,
        isstaff: undefined,
        level: undefined
    }
});