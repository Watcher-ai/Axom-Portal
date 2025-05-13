import React from 'react';
import styled from 'styled-components';
import { useTheme } from './../context/ThemeContext';
import { ThemeColors } from './../interfaces/Theme';
import ButtonPrimary from './button-primary/button-primary.component';

interface StyledProps {
  colors: ThemeColors;
}

const HeaderContainer = styled.header<StyledProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ colors }) => colors.background};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Logo = styled.div<{ color: string }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ color }) => color};
  padding: 0.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const NavLink = styled.a<{ color: string }>`
  color: ${({ color }) => color};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
  <>
    <HeaderContent/>
    {children}
  </>
  )
}

const HeaderContent: React.FC = () => {
  const { colors } = useTheme();

  return (
    <HeaderContainer colors={colors}>
      <Logo color={colors.text}>YourLogo</Logo>
      <Nav>
        {['Product', 'Solutions', 'Pricing', 'Docs'].map((item) => (
          <NavLink 
            key={item}
            color={colors.text} 
            href={`#${item.toLowerCase()}`}
          >
            {item}
          </NavLink>
        ))}
          <ButtonPrimary>
            <span style={{ textTransform: 'uppercase' }}>Get Started</span>
        </ButtonPrimary>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;