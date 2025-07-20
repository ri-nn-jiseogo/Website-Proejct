// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, setDoc } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBElhtp4yWZhKq7T99VO2v7d7qaeZy4lkM',
  authDomain: 'websiteproject2-fd659.firebaseapp.com',
  projectId: 'websiteproject2-fd659',
  storageBucket: 'websiteproject2-fd659.appspot.com',
  messagingSenderId: '97655553683',
  appId: '1:97655553683:web:d103fd9c477f3077199766',
  measurementId: 'G-YBG0KNX7KY',
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fetch all comments as an array of { id, ...data }
export async function getComments() {
  const snap = await getDocs(collection(db, 'comments'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Add or merge a single comment document
export async function addComment(id, comment) {
  const ref = doc(db, 'comments', id);
  await setDoc(ref, comment, { merge: true });
}

// Add or merge a single user document
export async function addUser(id, user) {
  const ref = doc(db, 'users', id);
  await setDoc(ref, user, { merge: true });
}

// Fetch all user documents (caller can inspect .docs)
export async function getUsers() {
  return await getDocs(collection(db, 'users'));
}

// Fetch all level documents
export async function getlevel() {
  return await getDocs(collection(db, 'level'));
}
