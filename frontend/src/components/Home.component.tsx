import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './../context/ThemeContext';
import { ThemeColors } from './../interfaces/Theme';
import ButtonPrimary from './button-primary/button-primary.component';
import Feature from './features/feature.component';

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

const HomePage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <AnimatePresence>
      <HomeContainer $colors={colors}>
        <Hero>
          <Title
            color={colors.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Monitor, Debug, and Optimize Your Application
          </Title>
          <Subtitle color={colors.text}>
            Get complete visibility into your application's performance and user experience.
            Identify and fix issues before they impact your users.
          </Subtitle>
          <ButtonPrimary
            // $color={colors}
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </ButtonPrimary>
        </Hero>
      </HomeContainer>
      <Feature></Feature>
    </AnimatePresence>
  );
};

export default HomePage;