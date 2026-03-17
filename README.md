# 🏥 HealBot — AI-Powered GitHub Test Fixer

An innovative demo showing how **n8n** automations can automatically fix failing tests using Claude AI.

## Features

- **Auto-Test Execution**: GitHub Actions runs tests on every push
- **Error Detection**: Webhook captures test failures in real-time
- **AI-Powered Fixes**: Claude AI analyzes logs and suggests/commits fixes
- **Live Dashboard**: Real-time status monitoring at http://localhost:3000
- **Test History**: Track all test runs with commit info

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/healbot-demo.git
cd healbot-demo
npm install
```

### 2. Run Locally
```bash
npm run server    # Start at http://localhost:3000
npm test          # Run tests (intentional bug in temperature conversion)
```

### 3. Push to GitHub
```bash
git add .
git commit -m "initial: healbot demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/healbot-demo.git
git push -u origin main
```

### 4. Add GitHub Secret
Settings → Secrets → Actions → New secret
- **Name**: `HEALBOT_WEBHOOK_URL`
- **Value**: Your n8n webhook URL (e.g., `https://your-ngrok-url/webhook/healbot-payload`)

### 5. Set up n8n Automation
Configure the n8n workflow to:
1. Listen for webhook from GitHub Actions
2. Extract test error from payload
3. Send to Claude API for analysis
4. Create fix commit via GitHub API

## File Structure

```
healbot-demo/
├── src/
│   ├── app.js           # Health data parsing (contains intentional bug)
│   └── app.test.js      # Tests that fail due to temperature bug
├── server/
│   └── server.js        # Express webhook receiver & dashboard server
├── dashboard/
│   ├── index.html       # Real-time status UI
│   ├── style.css        # Medical-themed styling
│   └── script.js        # Live updates
├── .github/workflows/
│   └── ci.yml           # GitHub Actions workflow
└── package.json
```

## The Bug (Intentional)

`src/app.js` has a wrong temperature conversion formula:
```javascript
// BUG: should be (celsius * 9/5) + 32
return celsius * 9 + 32;  // Missing division!
```

This fails the test expecting 100°C → 212°F (gets 932°F instead).

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook` | POST | Receives test results from GitHub Actions |
| `/result` | GET | Latest test result |
| `/history` | GET | Array of all past results |
| `/` | GET | Dashboard HTML |

## Payload Format

```json
{
  "status": "success|failure",
  "error_log": "test output",
  "ai_fix": "suggested fix",
  "commit": "abc1234",
  "branch": "main",
  "actor": "username",
  "repo": "owner/repo",
  "timestamp": "2026-03-18T12:34:56Z"
}
```

## Environment Variables

None required for local demo. For production (n8n integration):
- `GITHUB_TOKEN`: For commit/PR operations
- `CLAUDE_API_KEY`: For AI analysis

## License

MIT
