import React, { useState } from 'react';
import styles from './settings.module.css';
import PageLayout from '../page-layout/page-layout.component';

const Settings: React.FC = () => {
  const [filters, setFilters] = useState<{ type: string; key: string; value: string }>({
    type: '',
    key: '',
    value: '',
  });

  const [agents, setAgents] = useState<{ name: string; clientId: string; clientSecret: string }[]>([]);
  const [agentName, setAgentName] = useState('');

  const handleAddFilter = () => {
    console.log('Filter added:', filters);
    setFilters({ type: '', key: '', value: '' });
  };

  const handleAddAgent = () => {
    const clientId = `client_${Math.random().toString(36).substr(2, 9)}`;
    const clientSecret = `secret_${Math.random().toString(36).substr(2, 12)}`;
    setAgents([...agents, { name: agentName, clientId, clientSecret }]);
    setAgentName('');
  };

  return (
    <PageLayout>
      <div className={styles['settings-container']}>
        {/* Filter Section */}
        <div className={styles['section']}>
          <h2 className={styles['section-title']}>Add Filter for Requests</h2>
          <div className={styles['form-group']}>
            <label className={styles['label']}>Filter Type</label>
            <select
              className={styles['input']}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Select Filter Type</option>
              <option value="type1">Type 1</option>
              <option value="type2">Type 2</option>
              <option value="type3">Type 3</option>
            </select>
          </div>
          <div className={styles['form-group']}>
            <label className={styles['label']}>Key</label>
            <input
              className={styles['input']}
              type="text"
              value={filters.key}
              onChange={(e) => setFilters({ ...filters, key: e.target.value })}
            />
          </div>
          <div className={styles['form-group']}>
            <label className={styles['label']}>Value</label>
            <input
              className={styles['input']}
              type="text"
              value={filters.value}
              onChange={(e) => setFilters({ ...filters, value: e.target.value })}
            />
          </div>
          <button className={styles['add-button']} onClick={handleAddFilter}>
            +
          </button>
        </div>

        {/* Register Agents Section */}
        <div className={styles['section']}>
          <h2 className={styles['section-title']}>Register Agents</h2>
          <div className={styles['form-group']}>
            <label className={styles['label']}>Agent Name</label>
            <input
              className={styles['input']}
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
          </div>
          <button className={styles['add-button']} onClick={handleAddAgent}>
            +
          </button>
          <div className={styles['agents-list']}>
            {agents.map((agent, index) => (
              <div key={index} className={styles['agent-card']}>
                <p>
                  <strong>Agent Name:</strong> {agent.name}
                </p>
                <div className={styles['form-group']}>
                  <label className={styles['label']}>Client ID</label>
                  <input
                    className={styles['read-only-input']}
                    type="text"
                    value={agent.clientId}
                    readOnly
                  />
                </div>
                <div className={styles['form-group']}>
                  <label className={styles['label']}>Client Secret</label>
                  <input
                    className={styles['read-only-input']}
                    type="text"
                    value={agent.clientSecret}
                    readOnly
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;