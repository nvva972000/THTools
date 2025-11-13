import express from 'express';
import { generateCaption, generateContent } from '../controllers/aiGenerator.js';
import { getSettings, saveSettings } from '../controllers/aiSettings.js';

const router = express.Router();

/**
 * POST /api/ai/generate-caption
 * Generate caption from topic
 */
router.post('/generate-caption', async (req, res) => {
  try {
    const { topic, tone, goal, captionStyle } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }
    
    const result = await generateCaption(topic, tone, goal, captionStyle);
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ai/generate-content
 * Generate custom content
 */
router.post('/generate-content', async (req, res) => {
  try {
    const { content, tone } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }
    
    const result = await generateContent(content, tone);
    res.json(result);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/ai/settings
 * Get AI settings
 */
router.get('/settings', async (req, res) => {
  try {
    const result = await getSettings();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ai/settings
 * Save AI settings
 */
router.post('/settings', async (req, res) => {
  try {
    const settings = req.body;
    const result = await saveSettings(settings);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

