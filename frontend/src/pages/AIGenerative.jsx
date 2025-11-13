import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import { aiApi } from '../services/api';

export default function AIGenerative() {
  const [currentTab, setCurrentTab] = useState(0);
  const [input, setInput] = useState('');
  const [goal, setGoal] = useState('');
  const [captionStyle, setCaptionStyle] = useState('question');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    defaultTone: 'Chuyên nghiệp, thân thiện',
    captionDefaultGoal: 'Thu hút khách hàng, tăng tương tác',
    defaultCaptionStyle: 'question',
    temperature: 0.9,
    maxTokens: 1024,
    captionMaxTokens: 500,
    contentMaxTokens: 1024,
  });
  const [tempSettings, setTempSettings] = useState(settings);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await aiApi.getSettings();
      if (response.data.success) {
        setSettings(response.data.settings);
        setTempSettings(response.data.settings);
        setCaptionStyle(response.data.settings.defaultCaptionStyle || 'question');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await aiApi.saveSettings(tempSettings);
      if (response.data.success) {
        setSettings(tempSettings);
        setSettingsOpen(false);
        alert('Đã lưu cài đặt!');
      } else {
        alert('Lỗi khi lưu cài đặt');
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Vui lòng nhập nội dung!');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      let response;
      
      if (currentTab === 0) {
        // Caption
        response = await aiApi.generateCaption(input, '', goal, captionStyle);
      } else {
        // Custom Content
        response = await aiApi.generateContent(input, '');
      }

      if (response.data.success) {
        setResult(response.data.result);
      } else {
        setError(response.data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Đã copy vào clipboard!');
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setInput('');
    setGoal('');
    setCaptionStyle(settings.defaultCaptionStyle || 'question');
    setResult('');
    setError('');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          🤖 AI Generative
        </Typography>
        <IconButton onClick={() => setSettingsOpen(true)} color="primary">
          <SettingsIcon />
        </IconButton>
      </Box>

      <Card>
        <CardContent>
          {/* Tabs */}
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="📝 Generate Caption" />
            <Tab label="✨ Customize Content" />
          </Tabs>

          <Divider sx={{ mb: 3 }} />

          {/* Input Form */}
          <TextField
            fullWidth
            multiline
            rows={currentTab === 0 ? 2 : 6}
            label={currentTab === 0 ? 'Chủ đề' : 'Nội dung muốn generate'}
            placeholder={
              currentTab === 0
                ? 'VD: Sản phẩm điện thoại mới, ưu đãi giảm giá...'
                : 'VD: Viết review về sản phẩm ABC, bài viết về du lịch Đà Nẵng...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Goal field (only for Caption tab) */}
          {currentTab === 0 && (
            <TextField
              fullWidth
              label="Mục tiêu"
              placeholder="VD: Thu hút khách hàng, giữ chân người xem, tăng tương tác..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              sx={{ mb: 3 }}
            />
          )}

          {/* Caption Style Radio Buttons (only for Caption tab) */}
          {currentTab === 0 && (
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
                Phong cách Caption:
              </FormLabel>
              <RadioGroup
                value={captionStyle}
                onChange={(e) => setCaptionStyle(e.target.value)}
              >
                <FormControlLabel 
                  value="question" 
                  control={<Radio />} 
                  label="🤔 Câu hỏi gợi tò mò" 
                />
                <FormControlLabel 
                  value="shock" 
                  control={<Radio />} 
                  label="⚡ Câu nói gây sốc / khác biệt" 
                />
                <FormControlLabel 
                  value="stats" 
                  control={<Radio />} 
                  label="📊 Số liệu cụ thể" 
                />
                <FormControlLabel 
                  value="emotion" 
                  control={<Radio />} 
                  label="❤️ Kêu gọi cảm xúc" 
                />
                <FormControlLabel 
                  value="action" 
                  control={<Radio />} 
                  label="📢 Kêu gọi hành động (bình luận/chia sẻ/lưu lại)" 
                />
              </RadioGroup>
            </FormControl>
          )}

          {/* Generate Button */}
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            onClick={handleGenerate}
            disabled={loading}
            size="large"
            fullWidth
          >
            {loading ? 'Đang tạo...' : `Generate ${currentTab === 0 ? 'Caption' : 'Content'}`}
          </Button>

          {/* Info about settings */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
            {currentTab === 0 
              ? `Mặc định: ${settings.defaultTone} | ${settings.captionDefaultGoal}`
              : `Giọng điệu mặc định: ${settings.defaultTone}`
            } • Click ⚙️ để thay đổi
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* Result */}
          {result && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Kết quả:
                </Typography>
                <IconButton onClick={handleCopy} color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 3 }}>
                <Typography
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {result}
                </Typography>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon />
            <Typography variant="h6">Cài đặt AI</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Default Tone */}
            <TextField
              fullWidth
              label="Giọng điệu mặc định"
              value={tempSettings.defaultTone}
              onChange={(e) => setTempSettings({ ...tempSettings, defaultTone: e.target.value })}
              placeholder="VD: Chuyên nghiệp, thân thiện, hài hước..."
              sx={{ mb: 3 }}
            />

            {/* Caption Default Goal */}
            <TextField
              fullWidth
              label="Mục tiêu mặc định (Caption)"
              value={tempSettings.captionDefaultGoal}
              onChange={(e) => setTempSettings({ ...tempSettings, captionDefaultGoal: e.target.value })}
              placeholder="VD: Thu hút khách hàng, giữ chân người xem..."
              sx={{ mb: 3 }}
            />

            {/* Caption Default Style */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Phong cách Caption mặc định:
              </FormLabel>
              <RadioGroup
                value={tempSettings.defaultCaptionStyle || 'question'}
                onChange={(e) => setTempSettings({ ...tempSettings, defaultCaptionStyle: e.target.value })}
              >
                <FormControlLabel value="question" control={<Radio />} label="🤔 Câu hỏi gợi tò mò" />
                <FormControlLabel value="shock" control={<Radio />} label="⚡ Câu nói gây sốc / khác biệt" />
                <FormControlLabel value="stats" control={<Radio />} label="📊 Số liệu cụ thể" />
                <FormControlLabel value="emotion" control={<Radio />} label="❤️ Kêu gọi cảm xúc" />
                <FormControlLabel value="action" control={<Radio />} label="📢 Kêu gọi hành động" />
              </RadioGroup>
            </FormControl>

            {/* Temperature */}
            <Typography variant="subtitle2" gutterBottom>
              Temperature (Độ sáng tạo): {tempSettings.temperature}
            </Typography>
            <Slider
              value={tempSettings.temperature}
              onChange={(e, value) => setTempSettings({ ...tempSettings, temperature: value })}
              min={0}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
              0.0 = Chính xác, 1.0 = Sáng tạo
            </Typography>

            {/* Caption Max Tokens */}
            <TextField
              fullWidth
              type="number"
              label="Caption Max Tokens"
              value={tempSettings.captionMaxTokens}
              onChange={(e) => setTempSettings({ ...tempSettings, captionMaxTokens: parseInt(e.target.value) })}
              sx={{ mb: 3 }}
            />

            {/* Content Max Tokens */}
            <TextField
              fullWidth
              type="number"
              label="Content Max Tokens"
              value={tempSettings.contentMaxTokens}
              onChange={(e) => setTempSettings({ ...tempSettings, contentMaxTokens: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
