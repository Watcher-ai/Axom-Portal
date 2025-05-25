import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from './../../context/ThemeContext';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FlipCard = styled.div<{ $colors: any }>`
  perspective: 1200px;
  background: none;
  transition: transform 0.2s cubic-bezier(0.4,0.2,0.2,1);
  &:hover {
    transform: scale(1.04);
    z-index: 2;
  }
`;
const FlipInner = styled.div<{ flipped: boolean }>`
  width: 100%;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4,0.2,0.2,1);
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'none')};
`;
const FlipFace = styled.div<{ $colors: any; back?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: ${({ $colors, back }) => back ? ($colors.secondary || '#7f5fff') : ($colors.card || '#f8f8ff')};
  color: ${({ $colors, back }) => back ? '#fff' : $colors.text};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(127,95,255,0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.2rem;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 1.08rem;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
`;
const FlipBack = styled(FlipFace)`
  transform: rotateY(180deg);
`;

const features = [
  {
    title: 'Real-Time Analytics',
    desc: 'Monitor every agent, customer, and API call with instant, actionable insights.',
    funFact: 'Analytics help you spot trends and issues instantly—no more guesswork.'
  },
  {
    title: 'Automated Billing',
    desc: 'Usage-based, transparent billing for your customers—no more revenue leakage.',
    funFact: 'Automated billing means you can focus on growth, not manual invoices.'
  },
  {
    title: 'Multi-Tenant & Secure',
    desc: 'Built for scale with robust access controls and company isolation.',
    funFact: "Multi-tenant security keeps your customers' data safe and separated."
  },
  {
    title: 'Easy Integration',
    desc: 'Drop-in sidecar for any AI agent—start collecting data in minutes.',
    funFact: 'Integrate Watcher.AI with your stack in minutes—no code changes required.'
  },
];

const Feature: React.FC = () => {
  const { colors } = useTheme();
  const [flipped, setFlipped] = useState(Array(features.length).fill(false));

  const handleFlip = (idx: number) => {
    setFlipped(f => f.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <CardGrid>
      {features.map((f, idx) => (
        <FlipCard $colors={colors} key={f.title}>
          <FlipInner
            flipped={flipped[idx]}
            onClick={() => handleFlip(idx)}
          >
            <FlipFace $colors={colors}>
              <h3 style={{ color: colors.primary, fontWeight: 700, marginBottom: 12, fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>{f.title}</h3>
              <p style={{ color: colors.primary, fontSize: '1.05rem', marginBottom: 0, fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>{f.desc}</p>
              <span style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: colors.secondary, opacity: 0.7, fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                (Click to flip)
              </span>
            </FlipFace>
            <FlipBack $colors={colors} back>
              <h4 style={{ color: colors.secondary, fontWeight: 700, marginBottom: 12, fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>Did you know?</h4>
              <p style={{ color: '#fff', fontSize: '1.05rem', textAlign: 'center', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>{f.funFact}</p>
              <span style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#fff', opacity: 0.7, fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
                (Click to flip back)
              </span>
            </FlipBack>
          </FlipInner>
        </FlipCard>
      ))}
    </CardGrid>
  );
};

export default Feature;