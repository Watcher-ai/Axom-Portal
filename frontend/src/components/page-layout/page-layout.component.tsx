import React from 'react';
import SideNav from '../sidenav/sidenav.component';
import styles from './page-layout.module.css';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles['page-layout']}>
      <SideNav />
      <main className={styles['main-content']}>{children}</main>
    </div>
  );
};

export default PageLayout;