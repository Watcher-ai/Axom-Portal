import React from 'react';
import styles from './feature.module.css';
import { useTheme } from './../../context/ThemeContext';

const Feature: React.FC = () => {
    const { colors } = useTheme();
    return (
        <div 
            className={styles['main-container']}
            style={{ '--bg-color': colors.background } as React.CSSProperties}>
            <div
                className={styles['content-container']}
            >
                <h4 style={{ textTransform: 'uppercase' }}>LLM usage monitoring</h4>
                <h2 style={{ marginBottom: '20px' }}>Measure and Charge</h2>

                <div className={styles['image-container']}>
                    <img
                        src="https://picsum.photos/400/250"
                        alt="Example"
                        className = {styles['feature-image']}
                        style={{ '--border-color': colors.secondary } as React.CSSProperties}
                    />
                </div>
            </div>
            <br/><br/>
            <div
                className={styles['content-container']}
            >
                <h4 style={{ textTransform: 'uppercase' }}>Third party API usage monitoring</h4>
                <h2 style={{ marginBottom: '20px' }}>Capture the details and charge the right price</h2>

                <div className={styles['image-container']}>
                    <img
                        src="https://picsum.photos/400/250"
                        alt="Example"
                        className = {styles['feature-image']}
                        style={{ '--border-color': colors.secondary } as React.CSSProperties}
                    />
                </div>
            </div>
        </div>
        
    );
};

export default Feature;