import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './../../common/styles/gradient-effect.module.css';
import { useTheme } from './../../context/ThemeContext';

type ButtonPrimaryProps = HTMLMotionProps<'button'>;
const ButtonPrimary: React.FC<ButtonPrimaryProps> = (props) => {
      const { colors } = useTheme();
  return (
    <motion.button
      {...props}
      className={styles['gradient-background']}
      style={{ '--gradient-last-color': colors.secondary } as React.CSSProperties}
    >
      {props.children}
    </motion.button>
  );
};

export default ButtonPrimary;