import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Divider,
  Slider,
  Grid,
  IconButton,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';

export default function TextToSpeech() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        🔊 Text To Speech
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Voice Settings
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                defaultValue="Vietnamese"
                label="Language"
              >
                <MenuItem value="English (US)">English (US)</MenuItem>
                <MenuItem value="English (UK)">English (UK)</MenuItem>
                <MenuItem value="Vietnamese">Vietnamese</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                defaultValue="Female"
                label="Voice Type"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Neural">Neural</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Enter Text
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Enter the text you want to convert to speech"
            label="Text to convert..."
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Speed
          </Typography>
          <Slider
            defaultValue={1.0}
            min={0.5}
            max={2.0}
            step={0.1}
            marks
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            startIcon={<MicIcon />}
            size="large"
          >
            Generate Speech
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Generated Audio:
          </Typography>
          <Card variant="outlined" sx={{ bgcolor: 'action.hover', p: 2 }}>
            <Typography color="text.secondary" gutterBottom>
              Audio player will appear here...
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton color="primary">
                <PlayArrowIcon />
              </IconButton>
              <IconButton color="primary">
                <PauseIcon />
              </IconButton>
              <IconButton color="primary">
                <DownloadIcon />
              </IconButton>
            </Box>
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
}

