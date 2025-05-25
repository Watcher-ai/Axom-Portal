import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const Container = styled.div<{ $colors: any }>`
  max-width: 800px;
  margin: 80px auto 40px auto;
  padding: 2.5rem 2rem;
  background: ${({ $colors }) => $colors.background};
  color: ${({ $colors }) => $colors.text};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(127,95,255,0.07);
  font-size: 1.08rem;
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;
const Section = styled.section`
  margin-bottom: 2rem;
`;
const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
`;

const PrivacyPolicyPage: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Container $colors={colors}>
      <Title>Privacy Policy</Title>
      <Section>
        <p>Effective date: {new Date().getFullYear()}<br />
        Watcher.AI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.</p>
      </Section>
      <Section>
        <SectionTitle>1. Information We Collect</SectionTitle>
        <p>We collect information you provide directly (such as registration details, company info, and usage data) and information automatically collected through your use of our platform (such as log data, device info, and cookies).</p>
      </Section>
      <Section>
        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <p>We use your information to provide and improve our services, process transactions, communicate with you, ensure security, and comply with legal obligations.</p>
      </Section>
      <Section>
        <SectionTitle>3. Cookies & Tracking</SectionTitle>
        <p>We use cookies and similar technologies to enhance your experience, analyze usage, and deliver relevant content. You can control cookies through your browser settings.</p>
      </Section>
      <Section>
        <SectionTitle>4. Third-Party Services</SectionTitle>
        <p>We may use third-party services (such as analytics or payment processors) that collect, monitor, and analyze usage. These providers have their own privacy policies.</p>
      </Section>
      <Section>
        <SectionTitle>5. Data Security</SectionTitle>
        <p>We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure.</p>
      </Section>
      <Section>
        <SectionTitle>6. Your Rights</SectionTitle>
        <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
      </Section>
      <Section>
        <SectionTitle>7. Changes to This Policy</SectionTitle>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
      </Section>
      <Section>
        <SectionTitle>8. Contact Us</SectionTitle>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@watcher.ai" style={{ color: colors.primary }}>privacy@watcher.ai</a>.</p>
      </Section>
    </Container>
  );
};

export default PrivacyPolicyPage; 