import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DownloadIcon from '@mui/icons-material/Download';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

const tools = [
  {
    title: 'AI Generative',
    description: 'Generate content with AI models',
    icon: <SmartToyIcon sx={{ fontSize: 60 }} />,
    path: '/ai-generative',
  },
  {
    title: 'Processing Video',
    description: 'Trim, compress, and convert videos',
    icon: <VideoLibraryIcon sx={{ fontSize: 60 }} />,
    path: '/processing-video',
  },
  {
    title: 'TikTok Downloader',
    description: 'Download videos from TikTok and Douyin',
    icon: <DownloadIcon sx={{ fontSize: 60 }} />,
    path: '/tiktok-downloader',
  },
  {
    title: 'Text To Speech',
    description: 'Convert text to natural speech',
    icon: <RecordVoiceOverIcon sx={{ fontSize: 60 }} />,
    path: '/text-to-speech',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
        Welcome to THTools
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 6 }}>
        Your Personal Tool Collection
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={3} key={tool.title}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => navigate(tool.path)} sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2, color: 'primary.main' }}>
                    {tool.icon}
                  </Box>
                  <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

