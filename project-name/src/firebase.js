import { initializeApp } from "firebase/app";
import {doc, getDoc, getDocs, getFirestore, collection, setDoc} from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: "AIzaSyDJmZbFJc5l5eET0T0JgjIWPIm-UaeaVdQ",
  authDomain: "websiteproject-cb618.firebaseapp.com",
  projectId: "websiteproject-cb618",
  storageBucket: "websiteproject-cb618.firebasestorage.app",
  messagingSenderId: "924450092972",
  appId: "1:924450092972:web:d15a42a34d2feeb78aac09",
  measurementId: "G-E9TKTWG5GQ"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

async function getComments() {
  const commentsRef = collection(db, 'comments');
  const commentsSnapshot = await getDocs(commentsRef); // 전체 문서 가져오기

  commentsSnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

async function addComment(id, comment) {
    const commentRef = doc(db, 'comments', id)
    setDoc(commentRef, comment, { merge: true })
  }

async function addUser(id, user){
    const userRef = doc(db, 'users', id)
    setDoc(userRef, user, {merge: true })
}

async function getUsers() {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    return usersSnapshot
}

export {
  db,
  getComments,
  addComment,
  addUser,
  getUsers
}