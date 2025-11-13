import axios from 'axios';
import * as cheerio from 'cheerio';

// Hardcoded config
const SAVETIK_API_URL = 'https://savetik.io/api/ajaxSearch';
const SAVETIK_COOKIE = 'fpestid=JkyGiEb7INgdYgvrluc5M1R_FiczWD0abGSNwGDdBGftOpwWJtzN878sEbURKPaaYLRIhA';

/**
 * Get download info from SaveTik API
 */
export async function getDownloadInfo(videoUrl) {
  try {
    console.log('Calling SaveTik API for:', videoUrl);
    
    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('q', videoUrl);
    formData.append('cursor', '0');
    formData.append('page', '0');
    formData.append('lang', 'vi');
    
    console.log('Form data:', formData.toString());
    
    // Call API
    const response = await axios.post(SAVETIK_API_URL, formData.toString(), {
      headers: {
        'Cookie': SAVETIK_COOKIE,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 30000
    });
    
    console.log('API response status:', response.data.status);
    
    if (response.data.status !== 'ok') {
      console.log('API error:', response.data);
      return {
        success: false,
        error: 'API returned non-OK status'
      };
    }
    
    const htmlData = response.data.data;
    if (!htmlData) {
      return {
        success: false,
        error: 'No data in API response'
      };
    }
    
    // Parse HTML
    const $ = cheerio.load(htmlData);
    
    // Extract title
    const title = $('h3').first().text().trim() || 'Unknown';
    
    // Extract thumbnail
    const thumbnail = $('img').first().attr('src') || '';
    
    // Extract duration
    const duration = $('p').first().text().trim() || '';
    
    // Extract download links
    let hdLink = '';
    const sdLinks = [];
    let mp3Link = '';
    
    $('a.tik-button-dl').each((i, elem) => {
      const href = $(elem).attr('href') || '';
      const text = $(elem).text().trim();
      
      if (text.includes('MP4 HD')) {
        hdLink = href;
      } else if (text.includes('MP4 [')) {
        sdLinks.push(href);
      } else if (text.includes('MP3')) {
        mp3Link = href;
      }
    });
    
    if (!hdLink && sdLinks.length === 0) {
      return {
        success: false,
        error: 'No download links found in response'
      };
    }
    
    return {
      success: true,
      title,
      thumbnail,
      duration,
      hdLink,
      sdLinks,
      mp3Link
    };
    
  } catch (error) {
    console.error('Error in getDownloadInfo:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Request timeout'
      };
    }
    return {
      success: false,
      error: `Error: ${error.message}`
    };
  }
}

/**
 * Download video from URL
 * Note: For actual file download, client should handle streaming
 * This just returns the direct download URL
 */
export async function getDirectDownloadUrl(downloadUrl) {
  try {
    // Verify the URL is accessible
    const response = await axios.head(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const contentLength = parseInt(response.headers['content-length'] || 0);
    const sizeMB = (contentLength / (1024 * 1024)).toFixed(2);
    
    return {
      success: true,
      downloadUrl: downloadUrl,
      sizeMB: sizeMB
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to verify download URL: ${error.message}`
    };
  }
}

