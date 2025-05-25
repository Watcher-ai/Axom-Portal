import './App.css';
import React, { Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header.component';
import HomePage from './components/Home.component';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/routes/app-router';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
              <AppRouter/>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
