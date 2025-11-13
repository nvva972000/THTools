import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TikTok API
export const tiktokApi = {
  extractLinks: (text) => 
    api.post('/tiktok/extract-links', { text }),
  
  getDownloadInfo: (videoUrl, hdQuality = true) =>
    api.post('/tiktok/get-download-info', { videoUrl, hdQuality }),
  
  verifyDownload: (downloadUrl) =>
    api.post('/tiktok/verify-download', { downloadUrl }),
};

// AI API
export const aiApi = {
  generateCaption: (topic, tone, goal, captionStyle) =>
    api.post('/ai/generate-caption', { topic, tone, goal, captionStyle }),
  
  generateContent: (content, tone) =>
    api.post('/ai/generate-content', { content, tone }),
  
  getSettings: () =>
    api.get('/ai/settings'),
  
  saveSettings: (settings) =>
    api.post('/ai/settings', settings),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
