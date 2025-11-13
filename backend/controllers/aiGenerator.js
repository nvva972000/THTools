import axios from 'axios';
import { getSettings } from './aiSettings.js';

// Hardcoded config
const API_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const LLM_MODEL = 'gpt-oss-120b';
const API_KEY = 'sk-gojYePiQueqAHdllper3UA';

/**
 * Generate caption from topic
 */
export async function generateCaption(topic, tone, goal, captionStyle) {
  try {
    // Load settings from JSON
    const settingsResult = await getSettings();
    const settings = settingsResult.settings;
    
    const effectiveTone = tone || settings.defaultTone;
    const effectiveGoal = goal || settings.captionDefaultGoal;
    const effectiveStyle = captionStyle || settings.defaultCaptionStyle;
    
    // Map caption style to Vietnamese description
    const styleMap = {
      'question': 'Câu hỏi gợi tò mò',
      'shock': 'Câu nói gây sốc / khác biệt',
      'stats': 'Số liệu cụ thể',
      'emotion': 'Kêu gọi cảm xúc',
      'action': 'Kêu gọi hành động (bình luận/chia sẻ/lưu lại)'
    };
    
    const styleDescription = styleMap[effectiveStyle] || styleMap['question'];
    
    const systemPrompt = `Bạn là một copywriter chuyên nghiệp. Tạo caption theo giọng điệu: ${effectiveTone}`;

    const userPrompt = `Tạo một caption về chủ đề: ${topic}.\nMục tiêu: ${effectiveGoal}.\nPhong cách: ${styleDescription}.\nCaption phải ngắn gọn, súc tích, có sức hút và phù hợp để đăng trên mạng xã hội.`;

    const response = await axios.post(
      API_URL,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system_prompt: systemPrompt,
        streaming: false,
        temperature: settings.temperature,
        max_tokens: settings.captionMaxTokens,
        top_p: settings.topP,
        top_k: settings.topK,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 30000
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      const result = response.data.choices[0].message.content;
      return {
        success: true,
        result: result.trim(),
        usage: response.data.usage
      };
    }

    return {
      success: false,
      error: 'No result from LLM'
    };

  } catch (error) {
    console.error('Error in generateCaption:', error.message);
    return {
      success: false,
      error: `Error: ${error.message}`
    };
  }
}

/**
 * Generate custom content
 */
export async function generateContent(content, tone) {
  try {
    // Load settings from JSON
    const settingsResult = await getSettings();
    const settings = settingsResult.settings;
    
    const effectiveTone = tone || settings.defaultTone;
    const systemPrompt = `Bạn là một content writer chuyên nghiệp. Viết nội dung theo giọng điệu: ${effectiveTone}`;

    const userPrompt = `${content}`;

    const response = await axios.post(
      API_URL,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system_prompt: systemPrompt,
        streaming: false,
        temperature: settings.temperature,
        max_tokens: settings.contentMaxTokens,
        top_p: settings.topP,
        top_k: settings.topK,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 30000
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      const result = response.data.choices[0].message.content;
      return {
        success: true,
        result: result.trim(),
        usage: response.data.usage
      };
    }

    return {
      success: false,
      error: 'No result from LLM'
    };

  } catch (error) {
    console.error('Error in generateContent:', error.message);
    return {
      success: false,
      error: `Error: ${error.message}`
    };
  }
}

