import express from 'express';
import { extractVideoLinks, getVideoIdFromUrl } from '../utils/linkExtractor.js';
import { getDownloadInfo, getDirectDownloadUrl } from '../controllers/videoDownloader.js';

const router = express.Router();

/**
 * POST /api/tiktok/extract-links
 * Extract video links from text
 */
router.post('/extract-links', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }
    
    const links = extractVideoLinks(text);
    
    res.json({
      success: true,
      count: links.length,
      links: links
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tiktok/get-download-info
 * Get download information for a video URL
 */
router.post('/get-download-info', async (req, res) => {
  try {
    const { videoUrl, hdQuality } = req.body;
    
    console.log('Received request:', { videoUrl, hdQuality });
    
    if (!videoUrl) {
      console.log('ERROR: Video URL is missing');
      return res.status(400).json({
        success: false,
        error: 'Video URL is required'
      });
    }
    
    const info = await getDownloadInfo(videoUrl);
    
    if (!info.success) {
      return res.json(info);
    }
    
    // Select download link based on quality preference
    let downloadLink = '';
    if (hdQuality && info.hdLink) {
      downloadLink = info.hdLink;
    } else if (info.sdLinks.length > 0) {
      downloadLink = info.sdLinks[0];
    } else if (info.hdLink) {
      downloadLink = info.hdLink;
    }
    
    if (!downloadLink) {
      return res.json({
        success: false,
        error: 'No download link available'
      });
    }
    
    // Get video ID for filename
    const videoId = getVideoIdFromUrl(videoUrl);
    
    res.json({
      success: true,
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      downloadLink: downloadLink,
      filename: `${videoId}.mp4`
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tiktok/verify-download
 * Verify download URL and get file size
 */
router.post('/verify-download', async (req, res) => {
  try {
    const { downloadUrl } = req.body;
    
    if (!downloadUrl) {
      return res.status(400).json({
        success: false,
        error: 'Download URL is required'
      });
    }
    
    const result = await getDirectDownloadUrl(downloadUrl);
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

