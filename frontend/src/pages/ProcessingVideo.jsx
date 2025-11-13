import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Divider,
  LinearProgress,
  Grid,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UploadIcon from '@mui/icons-material/Upload';

export default function ProcessingVideo() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        🎥 Processing Video
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Upload Video
          </Typography>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            component="label"
            fullWidth
            sx={{ mb: 3, py: 2 }}
          >
            Choose video file
            <input type="file" hidden accept="video/*" />
          </Button>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Processing Type
          </Typography>
          <TextField
            select
            fullWidth
            defaultValue="Compress"
            label="Select operation"
            sx={{ mb: 3 }}
          >
            <MenuItem value="Trim">Trim</MenuItem>
            <MenuItem value="Compress">Compress</MenuItem>
            <MenuItem value="Convert Format">Convert Format</MenuItem>
            <MenuItem value="Extract Audio">Extract Audio</MenuItem>
            <MenuItem value="Add Watermark">Add Watermark</MenuItem>
          </TextField>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Settings
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Start Time" defaultValue="00:00:00" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="End Time" defaultValue="00:00:10" />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            size="large"
          >
            Start Processing
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Progress:
          </Typography>
          <LinearProgress variant="determinate" value={0} sx={{ mb: 3 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Processed Video:
          </Typography>
          <Card variant="outlined" sx={{ bgcolor: 'action.hover', p: 2 }}>
            <Typography color="text.secondary">
              Processed video will appear here...
            </Typography>
          </Card>
        </CardContent>
      </Card>
    </Box>
  );
}

