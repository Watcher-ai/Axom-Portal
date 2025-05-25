import React, { useEffect, useState } from 'react';
import PageLayout from '../page-layout/PageLayout';
import { useAuth } from '../../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface Agent {
  id: string;
  name: string;
  created_at: string;
  client_id: string;
  client_secret: string;
  owner_name: string;
  agent_secret: string;
}

interface APIKey {
  id: string;
  key: string;
  created_at: string;
  revoked: boolean;
}

interface Signal {
  id: string;
  // ...other fields as needed
}

const AgentsPage: React.FC = () => {
  const { token } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [apiKeys, setApiKeys] = useState<Record<string, any[]>>({});
  const [showCred, setShowCred] = useState<Record<string, boolean>>({});
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [apiKeyMsg, setApiKeyMsg] = useState<Record<string, string>>({});
  const [agentSignals, setAgentSignals] = useState<Record<string, Signal[]>>({});
  const [showOnboarding, setShowOnboarding] = useState<string | null>(null);
  const [unmasked, setUnmasked] = useState<Record<string, { secret: boolean; clientId: boolean; clientSecret: boolean }>>({});

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/agents', { headers: { Authorization: `Bearer ${token}` } });
        let data = await res.json();
        if (res.ok) setAgents(data ?? []);
        else setError(data.error || 'Failed to load agents');
      } catch {
        setError('Failed to load agents');
      }
      setLoading(false);
    };
    fetchAgents();
  }, [token]);

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/v1/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newAgentName }),
      });
      const data = await res.json();
      if (res.ok) {
        setAgents(a => [...a, data]);
        setNewAgentName('');
        setShowOnboarding(data.id);
        fetchSignalsForAgent(data.id);
      } else {
        setError(data.error || 'Failed to add agent');
      }
    } catch {
      setError('Failed to add agent');
    }
  };

  const handleDeleteAgent = async (id: string) => {
    setError('');
    try {
      const res = await fetch(`/api/v1/agents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAgents(a => a.filter(agent => agent.id !== id));
      else setError('Failed to delete agent');
    } catch {
      setError('Failed to delete agent');
    }
  };

  const handleShowCred = (id: string) => {
    setShowCred(sc => ({ ...sc, [id]: !sc[id] }));
  };

  const handleShowApiKeys = async (agentId: string) => {
    const newState = !showApiKeys[agentId];
    setShowApiKeys(prev => ({ ...prev, [agentId]: newState }));
    
    if (newState) {
      try {
        const response = await fetch(`/api/v1/agents/${agentId}/keys`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch API keys');
        }
        
        const data = await response.json();
        setApiKeys(prev => ({ ...prev, [agentId]: Array.isArray(data) ? data : [] }));
        setApiKeyMsg(prev => ({ ...prev, [agentId]: '' }));
      } catch (error) {
        console.error('Error fetching API keys:', error);
        setApiKeys(prev => ({ ...prev, [agentId]: [] }));
        setApiKeyMsg(prev => ({ ...prev, [agentId]: 'Failed to fetch API keys. Please try again.' }));
      }
    }
  };

  const handleCreateApiKey = async (agentId: string) => {
    setApiKeyMsg(prev => ({ ...prev, [agentId]: 'Creating API key...' }));
    try {
      const response = await fetch(`/api/v1/agents/${agentId}/keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create API key');
      }

      const newKey = await response.json();
      setApiKeys(prev => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), newKey],
      }));
      setApiKeyMsg(prev => ({ ...prev, [agentId]: 'API key created successfully!' }));
    } catch (error) {
      console.error('Error creating API key:', error);
      setApiKeyMsg(prev => ({ ...prev, [agentId]: 'Failed to create API key. Please try again.' }));
    }
  };

  const handleRevokeApiKey = async (agentId: string, keyId: string) => {
    try {
      const response = await fetch(`/api/v1/agents/${agentId}/keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      setApiKeys(prev => ({
        ...prev,
        [agentId]: (prev[agentId] || []).filter(key => key.id !== keyId),
      }));
    } catch (error) {
      console.error('Error revoking API key:', error);
    }
  };

  const fetchSignalsForAgent = async (agentId: string) => {
    try {
      const res = await fetch(`/api/v1/signals?agent_id=${agentId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setAgentSignals(s => ({ ...s, [agentId]: data }));
    } catch {}
  };

  useEffect(() => {
    if (agents.length > 0) {
      agents.forEach(agent => fetchSignalsForAgent(agent.id));
    }
    // eslint-disable-next-line
  }, [agents.length]);

  const fetchAndUnmask = async (agentId: string, field: 'secret' | 'clientId' | 'clientSecret') => {
    try {
      const res = await fetch(`/api/v1/agents/${agentId}/credentials`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setAgents(agents => agents.map(a => a.id === agentId ? { ...a, agent_secret: data.agent_secret, client_id: data.client_id, client_secret: data.client_secret } : a));
        setUnmasked(u => ({ ...u, [agentId]: { ...u[agentId], [field]: true } }));
      }
    } catch {}
  };

  const handleMask = (agentId: string, field: 'secret' | 'clientId' | 'clientSecret') => {
    setUnmasked(u => ({ ...u, [agentId]: { ...u[agentId], [field]: false } }));
  };

  return (
    <PageLayout>
      <h1 style={{ fontWeight: 700, marginBottom: 24 }}>Agents</h1>
      {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
        (!Array.isArray(agents) || agents.length === 0) ? (
          <div style={{ background: '#fff', borderRadius: 12, padding: 36, boxShadow: '0 2px 16px rgba(127,95,255,0.07)', maxWidth: 600, margin: '48px auto', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>No Agents Yet</h2>
            <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>You haven't added any AI agents to your company.</p>
            <form onSubmit={handleAddAgent} style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '24px auto 32px auto', maxWidth: 400 }}>
              <input type="text" placeholder="Agent Name" value={newAgentName} onChange={e => setNewAgentName(e.target.value)} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', flex: 1 }} />
              <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600 }}>Add Agent</button>
            </form>
            <ol style={{ textAlign: 'left', margin: '0 auto', maxWidth: 420, fontSize: 16, color: '#444', marginBottom: 24 }}>
              <li style={{ marginBottom: 12 }}><strong>Create an Agent:</strong> Use the form above to register your first agent.</li>
              <li style={{ marginBottom: 12 }}><strong>Copy the API Key:</strong> After creating an agent, copy the generated API key for integration.</li>
              <li style={{ marginBottom: 12 }}><strong>Download the Observer Sidecar:</strong> <a href="https://github.com/axom-ai/observer" target="_blank" rel="noopener noreferrer">Get the Observer from GitHub</a> and follow the README for your environment.</li>
              <li><strong>Configure & Deploy:</strong> Set your API key and agent ID in the Observer, then run it alongside your agent.</li>
            </ol>
            <div style={{ color: '#888', fontSize: 15, marginTop: 18 }}>
              Need help? <a href="mailto:support@watcher.ai" style={{ color: '#7f5fff' }}>Contact support</a>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleAddAgent} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32 }}>
              <input type="text" placeholder="Agent Name" value={newAgentName} onChange={e => setNewAgentName(e.target.value)} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '8px 18px', borderRadius: 6, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600 }}>Add Agent</button>
            </form>
            <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 32 }}>
              <thead>
                <tr style={{ background: '#f7f9fb' }}>
                  <th style={{ textAlign: 'left', padding: 10 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Agent ID</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Owner</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Created</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent.id}>
                    <td style={{ padding: 10 }}>{agent.name}</td>
                    <td style={{ padding: 10 }}>{agent.id}</td>
                    <td style={{ padding: 10 }}>{agent.owner_name}</td>
                    <td style={{ padding: 10 }}>{new Date(agent.created_at).toLocaleString()}</td>
                    <td style={{ padding: 10 }}>
                      <button 
                        onClick={() => handleShowCred(agent.id)} 
                        style={{ 
                          marginRight: 8, 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          background: '#eee', 
                          border: 'none', 
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Credentials
                      </button>
                      <button 
                        onClick={() => handleShowApiKeys(agent.id)} 
                        style={{ 
                          marginRight: 8, 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          background: '#2d6cdf', 
                          color: '#fff', 
                          border: 'none', 
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Show API Keys
                      </button>
                      <button 
                        onClick={() => handleDeleteAgent(agent.id)} 
                        style={{ 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          background: '#e74c3c', 
                          color: '#fff', 
                          border: 'none', 
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {agents.map(agent => (
              <React.Fragment key={agent.id}>
                {showCred[agent.id] && (
                  <div style={{ background: '#f7f9fb', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                    <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Credentials for {agent.name}</h3>
                    <div><strong>Client ID:</strong> {unmasked[agent.id]?.clientId ? (
                      <>
                        {agent.client_id}
                        <IconButton size="small" onClick={() => handleMask(agent.id, 'clientId')} aria-label="Hide client ID" style={{ marginLeft: 8 }}>
                          <VisibilityOff fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        {'•'.repeat(Math.max(8, agent.client_id?.length || 8))}
                        <IconButton size="small" onClick={() => fetchAndUnmask(agent.id, 'clientId')} aria-label="Show client ID" style={{ marginLeft: 8 }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    </div>
                    <div><strong>Client Secret:</strong> {unmasked[agent.id]?.clientSecret ? (
                      <>
                        {agent.client_secret}
                        <IconButton size="small" onClick={() => handleMask(agent.id, 'clientSecret')} aria-label="Hide client secret" style={{ marginLeft: 8 }}>
                          <VisibilityOff fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        {'•'.repeat(Math.max(8, agent.client_secret?.length || 8))}
                        <IconButton size="small" onClick={() => fetchAndUnmask(agent.id, 'clientSecret')} aria-label="Show client secret" style={{ marginLeft: 8 }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    </div>
                    <div><strong>Agent Secret:</strong> {unmasked[agent.id]?.secret ? (
                      <>
                        {agent.agent_secret}
                        <IconButton size="small" onClick={() => handleMask(agent.id, 'secret')} aria-label="Hide agent secret" style={{ marginLeft: 8 }}>
                          <VisibilityOff fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        {'•'.repeat(Math.max(8, agent.agent_secret?.length || 8))}
                        <IconButton size="small" onClick={() => fetchAndUnmask(agent.id, 'secret')} aria-label="Show agent secret" style={{ marginLeft: 8 }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    </div>
                  </div>
                )}
                {showApiKeys[agent.id] && (
                  <div style={{ 
                    background: '#f7f9fb', 
                    borderRadius: 8, 
                    padding: 24, 
                    marginBottom: 24,
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: 16 
                    }}>
                      <h3 style={{ 
                        fontWeight: 600, 
                        margin: 0,
                        color: '#2d3748'
                      }}>API Keys for {agent.name}</h3>
                      <button 
                        onClick={() => handleCreateApiKey(agent.id)} 
                        style={{ 
                          padding: '8px 16px', 
                          borderRadius: 6, 
                          background: '#2d6cdf', 
                          color: '#fff', 
                          border: 'none', 
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>Create API Key</span>
                      </button>
                    </div>

                    {apiKeyMsg[agent.id] && (
                      <div style={{ 
                        padding: '12px 16px', 
                        borderRadius: 6, 
                        marginBottom: 16,
                        background: apiKeyMsg[agent.id].includes('success') ? '#f0fdf4' : '#fef2f2',
                        color: apiKeyMsg[agent.id].includes('success') ? '#166534' : '#991b1b',
                        border: `1px solid ${apiKeyMsg[agent.id].includes('success') ? '#bbf7d0' : '#fecaca'}`
                      }}>
                        {apiKeyMsg[agent.id]}
                      </div>
                    )}

                    {apiKeys[agent.id]?.length > 0 ? (
                      <div style={{ 
                        background: '#fff', 
                        borderRadius: 6, 
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              <th style={{ textAlign: 'left', padding: 12, color: '#475569', fontWeight: 600 }}>Key</th>
                              <th style={{ textAlign: 'left', padding: 12, color: '#475569', fontWeight: 600 }}>Created</th>
                              <th style={{ textAlign: 'left', padding: 12, color: '#475569', fontWeight: 600 }}>Status</th>
                              <th style={{ textAlign: 'left', padding: 12, color: '#475569', fontWeight: 600 }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {apiKeys[agent.id].map(key => (
                              <tr key={key.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                <td style={{ padding: 12, color: '#1e293b' }}>{key.key}</td>
                                <td style={{ padding: 12, color: '#1e293b' }}>{new Date(key.created_at).toLocaleString()}</td>
                                <td style={{ padding: 12 }}>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    background: key.revoked ? '#fee2e2' : '#dcfce7',
                                    color: key.revoked ? '#991b1b' : '#166534'
                                  }}>
                                    {key.revoked ? 'Revoked' : 'Active'}
                                  </span>
                                </td>
                                <td style={{ padding: 12 }}>
                                  {!key.revoked && (
                                    <button 
                                      onClick={() => handleRevokeApiKey(agent.id, key.id)} 
                                      style={{ 
                                        padding: '6px 12px', 
                                        borderRadius: 6, 
                                        background: '#ef4444', 
                                        color: '#fff', 
                                        border: 'none', 
                                        fontWeight: 500,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Revoke
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ 
                        padding: 24, 
                        background: '#fff', 
                        borderRadius: 6, 
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        color: '#64748b'
                      }}>
                        {apiKeyMsg[agent.id] ? (
                          apiKeyMsg[agent.id]
                        ) : (
                          <>
                            <p style={{ marginBottom: 16 }}>No API keys created yet.</p>
                            <p>Click "Create API Key" to generate a new key for this agent.</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {/* Onboarding/Integration section if no signals */}
                {agentSignals[agent.id] && agentSignals[agent.id].length === 0 && (
                  <div style={{ marginTop: 24, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: 18 }}>
                    <h4 style={{ marginBottom: 8, color: '#ad8b00' }}>No Data Received Yet</h4>
                    <p style={{ color: '#ad8b00', marginBottom: 8 }}>We haven't received any signals from this agent yet. To complete integration:</p>
                    <ol style={{ color: '#ad8b00', marginBottom: 0 }}>
                      <li>Download and configure the Observer Sidecar with this Agent's credentials.</li>
                      <li>Deploy the Observer alongside your agent/container.</li>
                      <li>Once the Observer is running, signals will appear here automatically.</li>
                    </ol>
                    <div style={{ marginTop: 10, color: '#888' }}>Need help? <a href="mailto:support@watcher.ai" style={{ color: '#7f5fff' }}>Contact support</a></div>
                  </div>
                )}
                {/* Show onboarding after creation for new agent */}
                {showOnboarding === agent.id && (
                  <div style={{ background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 8, padding: 24, marginBottom: 24 }}>
                    <h3 style={{ color: '#096dd9', marginBottom: 8 }}>Agent Created!</h3>
                    <p style={{ color: '#096dd9', marginBottom: 8 }}>Next steps to complete integration:</p>
                    <ol style={{ color: '#096dd9', marginBottom: 0 }}>
                      <li>Copy the credentials above and configure your Observer Sidecar.</li>
                      <li>Deploy the Observer with your agent/container.</li>
                      <li>Once running, signals will appear here automatically.</li>
                    </ol>
                    <div style={{ marginTop: 10, color: '#888' }}>Need help? <a href="mailto:support@watcher.ai" style={{ color: '#7f5fff' }}>Contact support</a></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        )
      )}
    </PageLayout>
  );
};

export default AgentsPage; 