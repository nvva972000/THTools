import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import TikTokDownloader from './pages/TikTokDownloader';
import AIGenerative from './pages/AIGenerative';
import ProcessingVideo from './pages/ProcessingVideo';
import TextToSpeech from './pages/TextToSpeech';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout mode={mode} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-generative" element={<AIGenerative />} />
            <Route path="/processing-video" element={<ProcessingVideo />} />
            <Route path="/tiktok-downloader" element={<TikTokDownloader />} />
            <Route path="/text-to-speech" element={<TextToSpeech />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

