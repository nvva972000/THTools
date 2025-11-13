# THTools Backend

Node.js + Express backend for THTools application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Copy `.env.example` to `.env` (or use existing `.env`)
- Update values if needed

3. Run development server:
```bash
npm run dev
```

4. Run production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### TikTok Downloader
- `POST /api/tiktok/extract-links` - Extract video links from text
  - Body: `{ "text": "..." }`
  
- `POST /api/tiktok/get-download-info` - Get download info for a video
  - Body: `{ "videoUrl": "...", "hdQuality": true }`
  
- `POST /api/tiktok/verify-download` - Verify download URL
  - Body: `{ "downloadUrl": "..." }`

## Port

Default: `http://localhost:3000`

Can be changed in `.env` file.

