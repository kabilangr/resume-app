import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './hooks/useTheme';
import { LEGACY_ROUTES } from './utils/Constants';
import Navigation from './navigation/Navigation';
import Home from './home/Home';
import { About } from './About/About';
import { Skills } from './languages/Languages';
import { WorkExperience } from './workExperience/workExperience';
import { Projects } from './projects/Projects';
import { Contact } from './Contact/Contact';
import { Footer } from './components/Footer';

function Page() {
  const { hash } = useLocation();

  // Scroll to the section named in the hash (used by legacy route redirects).
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <div className="App">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Home />
        <About />
        <Skills />
        <WorkExperience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router basename={process.env.PUBLIC_URL} future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Page />} />
          {Object.entries(LEGACY_ROUTES).map(([path, id]) => (
            <Route key={path} path={path} element={<Navigate to={{ pathname: '/', hash: `#${id}` }} replace />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
