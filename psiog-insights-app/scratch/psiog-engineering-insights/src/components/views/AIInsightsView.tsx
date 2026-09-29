import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScoreBadge } from '../common/ScoreBadge';
import { queryAIAssistant } from '../../services/aiInsightsEngine';
import {
  Sparkles,
  AlertTriangle,
  Send,
  Bot,
  User,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const AIInsightsView: React.FC = () => {
  const {
    associates,
    projects,
    selectedAssociateId,
    setSelectedAssociateId,
    selectedProjectId,
    allReports,
    selectedAssociateReport
  } = useApp();

  const [prompt, setPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your **Psiog Engineering Insights AI Copilot**. I analyze multi-platform data across JIRA, Azure DevOps, Git, TestRail, and SharePoint to provide plain-English summaries, detect metric gaming heuristics, and ensure explainable performance attribution. Ask me anything or select a prompt below!`
    }
  ]);

  const selectedAssociate = associates.find(a => a.id === selectedAssociateId) || associates[0];
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Collect all anti-gaming flags across all reports
  const allFlagsWithAssociate = allReports.flatMap(r => {
    const assoc = associates.find(a => a.id === r.associateId);
    return r.antiGamingFlags.map(f => ({ ...f, associate: assoc }));
  });

  const handleSendPrompt = (textToSend?: string) => {
    const text = textToSend || prompt;
    if (!text.trim()) return;

    const userMessage = { sender: 'user' as const, text: text.trim() };
    setChatHistory(prev => [...prev, userMessage]);
    if (!textToSend) setPrompt('');

    // Generate AI response
    setTimeout(() => {
      const response = queryAIAssistant(text, {
        selectedAssociate,
        selectedReport: selectedAssociateReport,
        selectedProject,
        allProjects: projects,
        allReports,
        allAssociates: associates
      });

      setChatHistory(prev => [...prev, { sender: 'ai', text: response }]);
    }, 400);
  };

  const samplePrompts = [
    'Analyze Alex Rivera role transition and fair baseline adjustment',
    'Audit anti-gaming anomalies and flagged PRs',
    'Compare performance benchmarks across practice offerings',
    'Summarize Elena Rostova front-end delivery and onboarding'
  ];

  return (
    <div className="content-view">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Sparkles size={24} color="var(--accent-primary-light)" />
            AI Intelligence & Anti-Gaming Anomaly Center
          </h1>
          <p className="section-desc">
            Natural language performance synthesis, tenure transition reasoning, and anti-gaming heuristic monitoring
          </p>
        </div>
      </div>

      {/* Anti-Gaming Alerts Monitoring Panel (Criteria 9) */}
      <div className="glass-card" style={{ marginBottom: '28px', borderLeft: '4px solid var(--accent-rose)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
              Detected Anti-Gaming & Quality Anomalies ({allFlagsWithAssociate.length} Active Alerts)
            </h3>
          </div>
          <span className="pill-badge rose" style={{ fontSize: '0.74rem' }}>
            Anti-Gaming Heuristics v2.1
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Our anti-gaming engine safeguards against metric inflation by analyzing micro-commit bursts before sprint closes, unreviewed/self-approved pull requests, superficial reviews (&lt; 6 words), and ticket bounce churn.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {allFlagsWithAssociate.map(flag => (
            <div
              key={flag.id}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '14px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`pill-badge ${flag.severity === 'high' ? 'rose' : 'amber'}`} style={{ fontSize: '0.7rem' }}>
                    {flag.type} ({flag.severity.toUpperCase()})
                  </span>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.88rem' }}>
                    {flag.title}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {flag.description}
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--accent-primary-light)', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
                  {flag.evidence}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Engineer: <strong>{flag.associate?.name}</strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {new Date(flag.detectedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Prompt Sandbox */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Bot size={20} color="var(--accent-primary-light)" />
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>
            Interactive AI Insights Sandbox
          </h3>
        </div>

        {/* Quick Prompts Bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
            Suggested Queries:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              onClick={() => handleSendPrompt(p)}
            >
              <Sparkles size={12} color="var(--accent-cyan)" /> {p}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          minHeight: '280px',
          maxHeight: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '16px'
        }}>
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {msg.sender === 'ai' && (
                <div className="stat-icon indigo" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <Bot size={16} />
                </div>
              )}

              <div
                style={{
                  background: msg.sender === 'user' ? 'var(--accent-primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="stat-icon purple" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendPrompt();
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Ask AI about an engineer, project risks, gaming alerts, or tenure transitions..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
