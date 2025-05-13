import React from 'react';
import styles from './sidenav.module.css';
import { Link } from 'react-router-dom';

const SideNav: React.FC = () => {
  return (
    <nav className={styles['side-nav']}>
      <div className={styles['logo']}>MyLogo</div>
      <ul className={styles['nav-list']}>
      <li className={styles['nav-item']}>
          <Link to="/dashboard" className={styles['nav-link']}>Dashboard</Link>
        </li>
        <li className={styles['nav-item']}>
          <Link to="/analytics" className={styles['nav-link']}>Analytics</Link>
        </li>
        <li className={styles['nav-item']}>
          <Link to="/billing" className={styles['nav-link']}>Billing</Link>
        </li>
        <li className={styles['nav-item']}>
          <Link to="/settings" className={styles['nav-link']}>Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;