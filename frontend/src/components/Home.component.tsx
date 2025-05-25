import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './../context/ThemeContext';
import { ThemeColors } from './../interfaces/Theme';
import ButtonPrimary from './button-primary/button-primary.component';
import Feature from './features/feature.component';
import { useNavigate } from 'react-router-dom';

interface StyledProps {
  $colors: ThemeColors;
}

const HomeContainer = styled.div<StyledProps>`
  background: ${({ $colors }) => $colors.background};
  min-height: 100vh;
  padding-top: 80px;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 2rem;
`;

const Title = styled(motion.h1)<{ color: string }>`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: ${({ color }) => color};
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p<{ color: string }>`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: ${({ color }) => color};
  max-width: 600px;
  margin-bottom: 2rem;
`;

const LogoImage = styled(motion.img)`
  height: 240px;
  margin-bottom: 2.5rem;
  filter: drop-shadow(0 4px 48px rgba(80, 0, 180, 0.35)) drop-shadow(0 0 32px #7f5fff88);
  will-change: transform, filter;
`;

const Segment = styled.section`
  max-width: 800px;
  margin: 3rem auto 0 auto;
  padding: 2rem;
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(80,0,180,0.07);
  text-align: left;
`;
const SegmentTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;
const SegmentText = styled.p`
  font-size: 1.15rem;
  color: #bdbdbd;
  margin-bottom: 1.2rem;
`;

const SectionHeading = styled(SegmentTitle)`
  color: #7f5fff;
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 2rem;
`;
const BulletList = styled.ul`
  margin: 1rem 0 1.5rem 1.2rem;
  padding: 0;
  color: #bdbdbd;
  font-size: 1.08rem;
`;
const Bullet = styled.li`
  margin-bottom: 0.7rem;
  line-height: 1.6;
  &::marker {
    color: #7f5fff;
    font-size: 1.2em;
  }
`;

const LearnMoreSection = styled.section`
  max-width: 800px;
  margin: 3rem auto 0 auto;
  padding: 2rem;
  background: rgba(127, 95, 255, 0.07);
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(127,95,255,0.10);
  text-align: left;
`;
const LearnMoreTitle = styled.h3`
  font-size: 1.4rem;
  color: #7f5fff;
  margin-bottom: 1rem;
  font-weight: 700;
`;
const LearnMoreLinks = styled.ul`
  list-style: none;
  padding: 0;
`;
const LearnMoreLink = styled.a`
  display: block;
  margin-bottom: 0.8rem;
  color: #7f5fff;
  font-weight: 500;
  font-size: 1.08rem;
  text-decoration: none;
  border-left: 4px solid #7f5fff;
  padding-left: 0.7rem;
  transition: color 0.2s, border-color 0.2s;
  &:hover {
    color: #b388ff;
    border-color: #b388ff;
    text-decoration: underline;
  }
`;

const TopBar = styled.div<{ $colors: ThemeColors }>`
  position: absolute;
  top: 24px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 32px;
  z-index: 10;
  overflow: visible;
`;
const TopLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  min-width: 0;
  flex-shrink: 1;
`;
const PlainLink = styled.a<{ $colors: ThemeColors }>`
  color: ${({ $colors }) => $colors.text};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.08rem;
  opacity: 0.85;
  &:hover {
    text-decoration: underline;
    opacity: 1;
  }
`;

const HomePage: React.FC = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <HomeContainer $colors={colors}>
        <TopBar $colors={colors}>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: colors.text, letterSpacing: 1, marginRight: 'auto' }}>Watcher.AI</span>
          <TopLinks>
            <PlainLink $colors={colors} href="/login">Login</PlainLink>
            <PlainLink $colors={colors} href="/register">Register</PlainLink>
          </TopLinks>
        </TopBar>
        <Hero>
          <LogoImage
            src={require('../logo-transparent.png')}
            alt="Watcher AI Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.15, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <Title
            color={colors.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Unified Analytics & Billing for AI Agent Companies
          </Title>
          <Subtitle color={colors.text}>
            Watcher.AI empowers you to seamlessly monitor, analyze, and bill for every interaction your AI agents have across multiple services. Gain full transparency into usage, costs, and customer activity—so you can charge your clients accurately and maximize your revenue.
          </Subtitle>
          <div style={{ margin: '2.5rem 0' }}>
            <ButtonPrimary 
              style={{ fontSize: 18, padding: '16px 40px' }}
              onClick={() => navigate('/register')}
            >
              Start Free Trial
            </ButtonPrimary>
          </div>
        </Hero>
        <Feature />
        <Segment>
          <SectionHeading>The Challenge</SectionHeading>
          <SegmentText>
            For AI agent companies, tracking how agents interact with third-party APIs and services is a constant struggle. Without deep, real-time analytics, it's nearly impossible to understand true usage, control costs, or bill customers accurately. The result? Revenue leakage, billing disputes, and missed opportunities for growth.
          </SegmentText>
          <SectionHeading>How Watcher.AI Solves It</SectionHeading>
          <SegmentText>
            Watcher.AI seamlessly attaches a lightweight sidecar to every AI agent, capturing rich, granular data on every request, response, and resource consumed. Our intuitive dashboard transforms this data into actionable insights—so you can monitor usage, performance, and costs for every customer and service, all in real time.
          </SegmentText>
          <SectionHeading>Why Teams Choose Watcher.AI</SectionHeading>
          <BulletList>
            <Bullet>Instantly identify which customers and agents are driving costs</Bullet>
            <Bullet>Bill your clients with total confidence and transparency</Bullet>
            <Bullet>Spot anomalies, optimize resource allocation, and prevent costly overages</Bullet>
            <Bullet>Secure, multi-tenant, and built for production at scale</Bullet>
          </BulletList>
          <SegmentText>
            Join the leading AI companies who trust Watcher.AI to turn usage data into revenue. Stop guessing—start charging what you deserve.
          </SegmentText>
        </Segment>
        <LearnMoreSection>
          <LearnMoreTitle>Learn More &amp; Dive Deeper</LearnMoreTitle>
          <LearnMoreLinks>
            <li>
              <LearnMoreLink href="https://www.livex.ai/blog/7-best-practices-for-implementing-ai-saas-products-in-your-business" target="_blank" rel="noopener noreferrer">
                7 Best Practices for Implementing AI SaaS Products
              </LearnMoreLink>
            </li>
            <li>
              <LearnMoreLink href="https://www.younium.com/blog/ai-for-saas" target="_blank" rel="noopener noreferrer">
                How to Use AI for SaaS: Use Cases &amp; Best Practices
              </LearnMoreLink>
            </li>
            <li>
              <LearnMoreLink href="https://openmeter.io/blog/how-to-price-ai-products" target="_blank" rel="noopener noreferrer">
                How to Price AI Products: Usage-Based, Credits, and More
              </LearnMoreLink>
            </li>
            <li>
              <LearnMoreLink href="https://decagon.ai/resources/pricing-ai-agents" target="_blank" rel="noopener noreferrer">
                Pricing the AI Agent Economy (Decagon AI)
              </LearnMoreLink>
            </li>
            <li>
              <LearnMoreLink href="https://www.aalpha.net/blog/how-to-integrate-ai-agents-into-a-saas-platform/" target="_blank" rel="noopener noreferrer">
                How to Integrate AI Agents into a SaaS Platform
              </LearnMoreLink>
            </li>
          </LearnMoreLinks>
        </LearnMoreSection>
      </HomeContainer>
      <footer style={{ background: '#f8f8ff', padding: '2rem 0', marginTop: '3rem', textAlign: 'center', color: '#888', fontSize: '1rem' }}>
        <div style={{ marginBottom: '0.7rem' }}>
          <a href="/login" style={{ color: '#7f5fff', marginRight: 18, textDecoration: 'none', fontWeight: 500 }}>Login</a>
          <a href="/register" style={{ color: '#7f5fff', marginRight: 18, textDecoration: 'none', fontWeight: 500 }}>Register</a>
          <a href="/privacy" style={{ color: '#7f5fff', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>
        </div>
        <div>© {new Date().getFullYear()} Watcher.AI. All rights reserved.</div>
      </footer>
    </AnimatePresence>
  );
};

export default HomePage;