import { initializeApp } from "firebase/app";
import {doc, getDoc, getDocs, getFirestore, collection, setDoc} from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: "AIzaSyBElhtp4yWZhKq7T99VO2v7d7qaeZy4lkM",
  authDomain: "websiteproject2-fd659.firebaseapp.com",
  projectId: "websiteproject2-fd659",
  storageBucket: "websiteproject2-fd659.firebasestorage.app",
  messagingSenderId: "97655553683",
  appId: "1:97655553683:web:d103fd9c477f3077199766",
  measurementId: "G-YBG0KNX7KY"
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

async function getlevel() {
  const levelRef = collection(db, 'level');
  const usersSnapshot = await getDocs(levelRef);

  return usersSnapshot
}



export {
  db,
  getComments,
  addComment,
  addUser,
  getUsers,
  getlevel
}