import React from 'react';
import GreentextGenerator from './components/GreentextGenerator.jsx';
import ThemeProvider from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen transition-colors duration-200 bg-gray-100 dark:bg-gray-900">
        <div className="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <GreentextGenerator />
      </div>
    </ThemeProvider>
  );
}

export default App;
