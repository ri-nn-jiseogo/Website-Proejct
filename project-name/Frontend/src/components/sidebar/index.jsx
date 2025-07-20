import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Logo from '../../assets/logo.png';
import { useRecoilValue } from 'recoil';
import { userState } from '../../models/userinfos.js';
import styles from './sidebar.module.css';
import classNames from 'classnames';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.js';

const ROUTEMAP = {
  '/user': 'Stage & Ranking',
  '/user/learning': 'Learning Missions',
  '/user/challenges': 'Challenges',
  '/user/resources': 'Learning Resources',
  '/user/mypage': 'My Page',
  '/user/admin': 'Admin : Setting',
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const user = useRecoilValue(userState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarClasses = classNames(styles.sidebar, {
    [styles.open]: isSidebarOpen,
  });

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='position-fixed top-0 h-100 z-3 start-0'>
      <div className={sidebarClasses}>
        <div className='position-absolute top-0 start-100 m-2 d-sm-block d-md-none'>
          <Button variant='primary' onClick={handleToggleSidebar}>
            <MenuIcon />
          </Button>
        </div>
        <div className={styles['sidebar-wrapper']}>
          <img className={styles['logo']} src={Logo} alt='logo' />
          <ul className={styles['side-link']}>
            {Object.entries(ROUTEMAP).map(([path, label]) => {
              if (path === '/user/admin' && !user.isstaff) return null;
              const isActive = path === '/user' ? pathname === path : pathname.startsWith(path);
              return (
                <li key={path}>
                  <Link to={path} className={isActive ? styles.active : ''}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button
            className={['w-100', styles['logout-button']]}
            variant='primary'
            type='submit'
            onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const MenuIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='36'
    height='36'
    fill='currentColor'
    className='bi bi-list'
    viewBox='0 0 16 16'>
    <path
      fillRule='evenodd'
      d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5'
    />
  </svg>
);
