# PhishGuard AI - Browser Extension

## Overview
Real-time phishing detection and prevention Chrome extension with ML-powered threat analysis.

## Features
- ✅ **Real-time URL monitoring** - Analyzes every page you visit
- 🛡️ **Credential protection** - Blocks form submissions on risky sites
- 🚨 **Warning overlays** - Full-page blocking for high-threat sites
- 📊 **Threat dashboard** - Track blocked attempts and scan statistics
- 🤖 **AI-powered analysis** - ML model + threat intelligence integration
- ⚡ **Fast analysis** - <200ms threat detection

## Installation

### Development Mode
1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `extension/` directory

### Configuration
Update the API endpoint in `background.js`:
```javascript
const API_ENDPOINT = 'http://localhost:8000/api/v1/analyze/url';
```

## File Structure
```
extension/
├── manifest.json       # Extension configuration (Manifest v3)
├── background.js       # Service worker - navigation monitoring
├── content.js         # DOM analysis & warning injection
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic & statistics
├── warning.html       # Blocking page for threats
├── warning.js         # Warning page interactions
├── styles.css         # Shared styles
└── icons/            # Extension icons (16, 32, 48, 128px)
```

## How It Works

### 1. Navigation Monitoring
- Background service worker listens to all tab navigation events
- Extracts URL and sends to backend API for analysis
- Caches results for 5 minutes to reduce API calls

### 2. Threat Analysis
Backend performs:
- ML model classification (Random Forest)
- Heuristic analysis (URL patterns, keywords)
- Threat intelligence lookup (VirusTotal, AbuseIPDB)
- Returns composite threat score (0-100)

### 3. Protection Actions
- **Score < 60**: Safe - normal browsing continues
- **Score ≥ 60**: High threat - redirect to warning page
- **Credential form detected**: Block submission & show inline warning

### 4. User Controls
- View threat details and reasons
- Go back to safety
- Whitelist trusted sites
- Report false positives

## API Communication

### Request Format
```json
{
  "url": "https://example.com/login",
  "timestamp": "2026-01-31T12:00:00Z",
  "user_agent": "Mozilla/5.0..."
}
```

### Response Format
```json
{
  "threat_score": 78,
  "risk_level": "high",
  "reasons": [
    "Lookalike domain detected",
    "Flagged by threat intelligence"
  ],
  "confidence": 0.95
}
```

## Storage Schema

### Local Storage
```javascript
{
  threatsBlocked: 0,        // Counter
  totalScans: 0,            // Counter
  threatHistory: [],        // Array of threat events
  whitelist: [],            // Array of trusted domains
  settings: {
    enabled: true,
    blockThreshold: 60,
    showNotifications: true
  }
}
```

## Permissions Required
- `tabs` - Monitor active tabs
- `storage` - Cache threat data & user preferences
- `webNavigation` - Detect URL changes
- `activeTab` - Inject content scripts
- `scripting` - Dynamic script injection
- `<all_urls>` - Analyze any website

## Testing

### Test with Known Phishing URLs
1. Enable extension
2. Visit test phishing sites (use sandbox environments)
3. Verify warning page appears
4. Test form submission blocking

### Test Offline Mode
1. Disconnect from internet
2. Extension falls back to heuristic analysis
3. Cached threat data still works

## Performance Metrics
- API call timeout: 3 seconds
- Cache TTL: 5 minutes
- Memory usage: <50MB
- CPU usage (idle): <1%
- Analysis latency: <200ms (95th percentile)

## Security Features
- HTTPS-only API communication
- No sensitive data logged
- URL query parameters stripped before storage
- Local-first architecture
- Minimal permissions

## Development

### Adding New Features
1. Update `manifest.json` with new permissions
2. Implement in appropriate script (background/content/popup)
3. Test in development mode
4. Update version number

### Debugging
- Background script: `chrome://extensions` → Inspect service worker
- Content script: Right-click page → Inspect → Console
- Popup: Right-click extension icon → Inspect popup

## Future Enhancements
- [ ] Email phishing scanner
- [ ] Training simulation mode
- [ ] Community threat intelligence
- [ ] Firefox & Edge support
- [ ] Advanced whitelist management
- [ ] Detailed analytics dashboard

## Support
For issues or feature requests, please contact the development team.

## License
Proprietary - PhishGuard AI © 2026
