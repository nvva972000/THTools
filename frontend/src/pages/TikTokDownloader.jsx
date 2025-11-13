import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import { tiktokApi } from '../services/api';

export default function TikTokDownloader() {
  const [text, setText] = useState('');
  const [hdQuality, setHdQuality] = useState(true);
  const [videos, setVideos] = useState([]);
  const [logs, setLogs] = useState('[INFO] Ready to download videos...\\n');
  const [isDownloading, setIsDownloading] = useState(false);
  const cancelRef = useRef(false);

  const addLog = (message, level = 'INFO') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => `${prev}[${level}] ${timestamp} - ${message}\\n`);
  };

  const handleClear = () => {
    setText('');
    setVideos([]);
    setLogs('[INFO] Cleared.\\n');
  };

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs);
    addLog('Logs copied to clipboard!', 'SUCCESS');
  };

  const handleDownload = async () => {
    if (isDownloading) {
      addLog('Download already in progress!', 'WARNING');
      return;
    }

    if (!text.trim()) {
      addLog('No input provided', 'WARNING');
      return;
    }

    // Reset cancel flag
    cancelRef.current = false;
    
    setIsDownloading(true);
    addLog('Extracting video links from text...');

    try {
      // Extract links
      const { data: extractData } = await tiktokApi.extractLinks(text);
      
      if (!extractData.success || extractData.count === 0) {
        addLog('No video links found in the text', 'ERROR');
        setIsDownloading(false);
        return;
      }

      const links = extractData.links;
      addLog(`Found ${links.length} video link(s)`, 'SUCCESS');

      // Initialize video items
      const videoItems = links.map((url, idx) => ({
        id: idx,
        url,
        status: 'pending',
        progress: 0,
        title: `Video ${idx + 1}`,
        error: null,
        downloadLink: null,
      }));
      setVideos(videoItems);

      // Download each video
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < videoItems.length; i++) {
        if (cancelRef.current) {
          addLog('Download cancelled by user', 'WARNING');
          break;
        }

        const video = videoItems[i];
        const idx = i + 1;

        // Update status: Fetching
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id
              ? { ...v, status: 'fetching', progress: 0 }
              : v
          )
        );
        addLog(`[${idx}/${videoItems.length}] Fetching info for: ${video.url}`);

        try {
          // Get download info
          const { data: infoData } = await tiktokApi.getDownloadInfo(video.url, hdQuality);

          if (!infoData.success) {
            throw new Error(infoData.error);
          }

          // Update status: Downloading
          setVideos((prev) =>
            prev.map((v) =>
              v.id === video.id
                ? {
                    ...v,
                    title: infoData.title,
                    thumbnail: infoData.thumbnail,
                    downloadLink: infoData.downloadLink,
                    status: 'downloading',
                    progress: 50,
                  }
                : v
            )
          );
          
          addLog(`[${idx}/${videoItems.length}] Downloading: ${infoData.title.substring(0, 50)}...`);

          // Auto download the video
          try {
            const response = await fetch(infoData.downloadLink);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = infoData.filename || `video_${video.id}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Update status: Done
            setVideos((prev) =>
              prev.map((v) =>
                v.id === video.id
                  ? {
                      ...v,
                      status: 'done',
                      progress: 100,
                    }
                  : v
              )
            );
            
            addLog(`[${idx}/${videoItems.length}] Downloaded: ${infoData.filename}`, 'SUCCESS');
            successCount++;
          } catch (downloadError) {
            throw new Error(`Download failed: ${downloadError.message}`);
          }
        } catch (error) {
          setVideos((prev) =>
            prev.map((v) =>
              v.id === video.id
                ? {
                    ...v,
                    status: 'error',
                    error: error.message || 'Failed to fetch',
                  }
                : v
            )
          );
          addLog(`[${idx}/${videoItems.length}] Failed: ${error.message}`, 'ERROR');
          errorCount++;
        }

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      addLog(`=== COMPLETED: ${successCount} success, ${errorCount} failed ===`, 'INFO');
    } catch (error) {
      addLog(`Error: ${error.message}`, 'ERROR');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancelDownload = () => {
    cancelRef.current = true;
    setIsDownloading(false);
    addLog('Cancelling download...', 'WARNING');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon color="action" />;
      case 'fetching':
        return <PendingIcon color="primary" />;
      case 'downloading':
        return <DownloadIcon color="primary" />;
      case 'done':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  const getStatusText = (video) => {
    switch (video.status) {
      case 'pending':
        return 'Pending...';
      case 'fetching':
        return 'Fetching download link...';
      case 'downloading':
        return 'Downloading video...';
      case 'done':
        return 'Download completed!';
      case 'error':
        return `Error: ${video.error}`;
      default:
        return '';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        📥 TikTok / Douyin Video Downloader
      </Typography>

      <Card>
        <CardContent>
          {/* Instructions */}
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>ℹ️ Instructions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" component="div">
                <strong>How to use:</strong>
                <ol>
                  <li>Paste one or multiple video links (TikTok/Douyin)</li>
                  <li>Links can be on separate lines or mixed with text</li>
                  <li>Select HD quality if you want high quality videos</li>
                  <li>Click "Download Videos" and wait</li>
                  <li>Right-click on download links and "Save link as..." to download</li>
                </ol>
                <strong>Supported links:</strong>
                <ul>
                  <li>https://v.douyin.com/xxxxx/</li>
                  <li>https://vm.tiktok.com/xxxxx/</li>
                  <li>https://www.tiktok.com/@username/video/123456789</li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Input Section */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Paste video links here:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://v.douyin.com/nibsxHHdf/&#10;https://v.douyin.com/another/&#10;&#10;Or paste text containing links..."
            sx={{ mb: 2 }}
          />

          {/* Settings */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hdQuality}
                  onChange={(e) => setHdQuality(e.target.checked)}
                />
              }
              label="Download HD Quality"
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              Download Videos
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelDownload}
              disabled={!isDownloading}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>

          {/* Progress Section */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Download Progress:
          </Typography>

          {videos.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              No videos to download yet. Paste links above and click "Download Videos".
            </Alert>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Thumbnail */}
                    {video.thumbnail ? (
                      <Box
                        component="img"
                        src={video.thumbnail}
                        alt={video.title}
                        sx={{
                          width: '100%',
                          height: 180,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: 180,
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getStatusIcon(video.status)}
                      </Box>
                    )}
                    
                    {/* Content */}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusIcon(video.status)}
                        <Typography variant="caption" fontWeight="bold">
                          {getStatusText(video)}
                        </Typography>
                      </Box>
                      
                      {(video.status === 'fetching' || video.status === 'downloading') && (
                        <LinearProgress sx={{ mb: 1 }} />
                      )}
                      
                      {video.status === 'done' && (
                        <Typography variant="caption" color="success.main" gutterBottom>
                          ✓ Downloaded
                        </Typography>
                      )}
                      
                      {video.title && video.title !== `Video ${video.id + 1}` && (
                        <Typography 
                          variant="body2" 
                          color="text.primary"
                          fontWeight="medium"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 1,
                            flexGrow: 1,
                          }}
                        >
                          {video.title}
                        </Typography>
                      )}
                      
                      {video.status === 'error' && (
                        <Typography variant="caption" color="error" gutterBottom>
                          {video.error}
                        </Typography>
                      )}
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mt: 'auto',
                        }}
                      >
                        {video.url}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}

