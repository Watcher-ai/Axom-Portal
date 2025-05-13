import React from 'react';
import PageLayout from '../page-layout/page-layout.component';
import styles from './dashboard-page.module.css';

const DashboardPage: React.FC = () => {
  return (
    <PageLayout>
      <div className={styles['dashboard-header']}>
        <h1>Welcome to the Dashboard</h1>
        <p>Here is an overview of your application performance and usage.</p>
      </div>
      <div className={styles['dashboard-content']}>
        <div className={styles['card']}>Card 1</div>
        <div className={styles['card']}>Card 2</div>
        <div className={styles['card']}>Card 3</div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;