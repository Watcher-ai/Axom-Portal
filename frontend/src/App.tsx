import logo from './logo.svg';
import './App.css';
import React, { Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header.component';
import HomePage from './components/Home.component';

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <HomePage />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
