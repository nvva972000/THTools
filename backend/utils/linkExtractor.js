/**
 * Extract video links from text
 * Supports: TikTok, Douyin links
 */
export function extractVideoLinks(text) {
  const links = [];
  
  // Pattern for TikTok/Douyin short links
  // Supports underscore (_) and dash (-) in short codes
  const pattern = /https?:\/\/(?:www\.)?(?:v\.douyin\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/[A-Za-z0-9_-]+\/?/g;
  const shortLinks = text.match(pattern) || [];
  links.push(...shortLinks);
  
  // Pattern for full TikTok links
  const fullPattern = /https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/g;
  const fullLinks = text.match(fullPattern) || [];
  links.push(...fullLinks);
  
  // Normalize links: ensure trailing slash
  const normalized = links.map(link => {
    return link.endsWith('/') ? link : link + '/';
  });
  
  // Remove duplicates while preserving order
  return [...new Set(normalized)];
}

/**
 * Extract a short ID from video URL for filename
 */
export function getVideoIdFromUrl(url) {
  const match = url.match(/\/([A-Za-z0-9_-]+)\/?$/);
  if (match) {
    return match[1];
  }
  return Date.now().toString();
}

