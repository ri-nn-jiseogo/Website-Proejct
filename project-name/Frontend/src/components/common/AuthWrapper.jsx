import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth as firebaseAuth, getUsers } from '../../firebase';
import { useRecoilState } from 'recoil';
import { defaultUserState, userState } from '../../models/userinfos';

export default function AuthWrapper({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    if (!auth && !isAuthPage) {
      navigate('/login', { replace: true });
    }
  }, [auth, location.pathname, navigate]);

  useEffect(() => {
    async function setCurrentUser() {
      if (user !== defaultUserState) return;

      const userId = sessionStorage.getItem('userId');
      if (userId) {
        const users = await getUsers();
        const userDoc = users.docs.find((doc) => doc.id === userId);

        if (!userDoc) {
          return;
        }

        const userData = userDoc.data();
        setUser({
          Id: userDoc.id,
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          grade: userData.grade,
          isstaff: userData.isstaff,
          tier: userData.tier,
          stats: userData.stats,
          challenges: userData.challenges,
        })
      }
    }

    if (auth) {
      setCurrentUser();
    } else {
      setUser(defaultUserState)
    }
  }, [auth, user, setUser])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setAuth(firebaseUser);
      } else {
        setAuth(null);
      }
    });

    return unsubscribe;
  }, []);

  return children;
}
