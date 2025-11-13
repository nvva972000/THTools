import fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Fix for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SETTINGS_FILE = join(__dirname, '../data/ai-settings.json');

/**
 * Get AI settings
 */
export async function getSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return {
      success: true,
      settings: JSON.parse(data)
    };
  } catch (error) {
    console.error('Error reading settings:', error.message);
    
    // Return default settings if file doesn't exist
    return {
      success: true,
      settings: {
        defaultTone: 'Chuyên nghiệp, thân thiện',
        captionDefaultGoal: 'Thu hút khách hàng, tăng tương tác',
        defaultCaptionStyle: 'question',
        temperature: 0.9,
        maxTokens: 1024,
        captionMaxTokens: 500,
        contentMaxTokens: 1024,
        topP: 0.95,
        topK: 40
      }
    };
  }
}

/**
 * Save AI settings
 */
export async function saveSettings(settings) {
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return {
      success: true,
      message: 'Settings saved successfully'
    };
  } catch (error) {
    console.error('Error saving settings:', error.message);
    return {
      success: false,
      error: `Error: ${error.message}`
    };
  }
}

