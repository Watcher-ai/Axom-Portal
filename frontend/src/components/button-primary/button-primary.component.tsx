import React from 'react';
import styles from './../../common/styles/gradient-effect.module.css';
import { useTheme } from './../../context/ThemeContext';

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactElement;
}
const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ icon, children, ...props }) => {
  const { colors } = useTheme();
  return (
    <button
      {...props}
      className={styles['gradient-background']}
      style={{ '--gradient-last-color': colors.secondary, ...props.style } as React.CSSProperties}
    >
      {icon && <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};

export default ButtonPrimary;