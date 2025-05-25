import React, { useEffect, useState } from 'react';
import PageLayout from '../page-layout/PageLayout';
import { useAuth } from '../../context/AuthContext';
import styles from './dashboard-page.module.css';

interface Summary {
  agent_id: string;
  protocol: string;
  operation: string;
  count: number;
  avg_latency: number;
  error_rate: number;
}

interface Timeseries {
  bucket: string;
  count: number;
}

const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState<Summary[]>([]);
  const [timeseries, setTimeseries] = useState<Timeseries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/signals/summary', { headers: { Authorization: `Bearer ${token}` } });
        let data = await res.json();
        if (res.ok) setSummary(data ?? []);
        const res2 = await fetch('/api/v1/signals/timeseries', { headers: { Authorization: `Bearer ${token}` } });
        let data2 = await res2.json();
        if (res2.ok) setTimeseries(data2 ?? []);
      } catch {
        setError('Failed to load analytics');
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // Calculate summary stats
  const totalSignals = summary.reduce((sum, s) => sum + s.count, 0);
  const avgLatency = summary.length ? (summary.reduce((sum, s) => sum + s.avg_latency * s.count, 0) / (totalSignals || 1)) : 0;
  const errorRate = summary.length ? (summary.reduce((sum, s) => sum + s.error_rate * s.count, 0) / (totalSignals || 1)) : 0;

  // Show welcome/integration state if no data
  const showWelcome = !loading && !error && (!summary.length || !timeseries.length);

  return (
    <PageLayout>
      <div className={styles['dashboard-header']}>
        <h1>Dashboard</h1>
        <p>Overview of your application performance and usage.</p>
      </div>
      {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : showWelcome ? (
        <div style={{ background: '#fff', borderRadius: 12, padding: 36, boxShadow: '0 2px 16px rgba(127,95,255,0.07)', maxWidth: 600, margin: '48px auto', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Welcome to Watcher.AI!</h2>
          <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>You haven't connected any AI agents yet.</p>
          <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 420, fontSize: 16, color: '#444', marginBottom: 24 }}>
            <li style={{ marginBottom: 12 }}><strong>Generate an API Key:</strong> Go to the <b>Agents</b> page and create a new agent. Copy the generated API key.</li>
            <li style={{ marginBottom: 12 }}><strong>Download the Observer Sidecar:</strong> <a href="https://github.com/axom-ai/observer" target="_blank" rel="noopener noreferrer">Get the Observer from GitHub</a> and follow the README for your environment.</li>
            <li style={{ marginBottom: 12 }}><strong>Configure the Sidecar:</strong> Set your API key and agent ID in the Observer config file or environment variables.</li>
            <li style={{ marginBottom: 12 }}><strong>Deploy the Sidecar:</strong> Run the Observer alongside your AI agent container or process.</li>
            <li><strong>See Data Here:</strong> Once your agent is live, signals and analytics will appear on this dashboard.</li>
          </ol>
          <div style={{ color: '#888', fontSize: 15, marginTop: 18 }}>
            Need help? <a href="mailto:support@watcher.ai" style={{ color: '#7f5fff' }}>Contact support</a>
          </div>
        </div>
      ) : (
        <>
          <div className={styles['dashboard-content']} style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
            <div className={styles['card']} style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#888' }}>Total Signals</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{totalSignals}</div>
            </div>
            <div className={styles['card']} style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#888' }}>Avg. Latency (ms)</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{avgLatency.toFixed(1)}</div>
            </div>
            <div className={styles['card']} style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#888' }}>Error Rate</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{(errorRate * 100).toFixed(2)}%</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontWeight: 600, marginBottom: 16 }}>Signals Over Time</h2>
            {/* Simple SVG line chart placeholder */}
            <svg width="100%" height="120" viewBox="0 0 400 120" style={{ background: '#f7f9fb', borderRadius: 8 }}>
              {timeseries.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#2d6cdf"
                  strokeWidth="3"
                  points={timeseries.map((d, i) => `${(i / (timeseries.length - 1)) * 400},${120 - (d.count / Math.max(...timeseries.map(t => t.count), 1)) * 100}`).join(' ')}
                />
              )}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginTop: 8 }}>
              {timeseries.slice(0, 5).map((d, i) => <span key={i}>{new Date(d.bucket).toLocaleDateString()}</span>)}
              {timeseries.length > 5 && <span>...</span>}
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontWeight: 600, marginBottom: 16 }}>Top Agents/Services</h2>
            {summary.length === 0 ? (
              <div style={{ color: '#888', fontSize: 16, textAlign: 'center', padding: 24 }}>No agent data yet. Once your agents are sending signals, you'll see them here.</div>
            ) : (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ background: '#f7f9fb' }}>
                    <th style={{ textAlign: 'left', padding: 10 }}>Agent</th>
                    <th style={{ textAlign: 'left', padding: 10 }}>Protocol</th>
                    <th style={{ textAlign: 'left', padding: 10 }}>Operation</th>
                    <th style={{ textAlign: 'left', padding: 10 }}>Count</th>
                    <th style={{ textAlign: 'left', padding: 10 }}>Avg. Latency</th>
                    <th style={{ textAlign: 'left', padding: 10 }}>Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: 10 }}>{row.agent_id}</td>
                      <td style={{ padding: 10 }}>{row.protocol}</td>
                      <td style={{ padding: 10 }}>{row.operation}</td>
                      <td style={{ padding: 10 }}>{row.count}</td>
                      <td style={{ padding: 10 }}>{row.avg_latency.toFixed(1)}</td>
                      <td style={{ padding: 10 }}>{(row.error_rate * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default DashboardPage;