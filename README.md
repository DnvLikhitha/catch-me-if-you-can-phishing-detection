# PhishGuard AI - Full Stack Application

Complete phishing detection system with FastAPI backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+ (3.13 recommended)
- Node.js 18+ and npm
- Git

### Installation & Setup

1. **Clone and navigate to project:**
   ```bash
   cd catch-me-if-you-can-phishing-detection
   ```

2. **Run setup script:**
   ```powershell
   .\setup.ps1
   ```

   This will:
   - Create Python virtual environment
   - Install backend dependencies
   - Train ML models
   - Install frontend dependencies
   - Create configuration files

3. **Start the application:**
   ```powershell
   .\start.ps1
   ```

   This starts both:
   - **Backend** (FastAPI): http://localhost:8000
   - **Frontend** (React): http://localhost:5173

## 📍 Access Points

- **Dashboard**: http://localhost:5173
- **API**: http://localhost:8000
- **API Docs** (Swagger): http://localhost:8000/docs
- **API Redoc**: http://localhost:8000/redoc

## 🏗️ Architecture

```
catch-me-if-you-can-phishing-detection/
├── backend/                  # FastAPI Backend
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Configuration
│   ├── train_model.py       # ML model training
│   ├── requirements.txt     # Python dependencies
│   ├── api/                 # API endpoints
│   │   └── v1/             # API version 1
│   ├── features/            # Feature extractors
│   │   ├── url_features.py
│   │   ├── heuristic_scorer.py
│   │   ├── lookalike_detector.py
│   │   └── brand_impersonation.py
│   ├── ml/                  # Machine learning
│   │   └── model.py
│   ├── scoring/             # Composite scoring
│   │   └── composite_scorer.py
│   ├── utils/               # Utilities
│   │   └── cache.py
│   └── models/              # Trained ML models
│
├── dashboard/               # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── config/         # API configuration
│   │   │   └── api.js      # Backend API client
│   │   └── main.jsx        # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── extension/               # Browser Extension
│   └── content.js
│
├── start.ps1               # Startup script
└── setup.ps1               # Setup script
```

## 🔧 Manual Setup

### Backend Setup

```powershell
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Train ML models
python train_model.py

# Start server
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

### Frontend Setup

```powershell
cd dashboard

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start dev server
npm run dev
```

## 🧪 Testing the API

### Using Swagger UI
1. Open http://localhost:8000/docs
2. Try the `/api/v1/analyze/url` endpoint
3. Test URLs:
   - **Phishing**: `http://paypal-secure-verify.tk/account/login`
   - **Homoglyph**: `https://g00gle.com/signin`
   - **Legitimate**: `https://github.com/login`

### Using the Dashboard
1. Open http://localhost:5173
2. Enter a URL in the analyzer
3. View detailed threat analysis with visual breakdown

### Using cURL

```bash
curl -X POST http://localhost:8000/api/v1/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://paypal-secure-verify.tk/account/login"}'
```

## 📊 Features

### Backend (FastAPI)
- ✅ ML-based phishing detection (Random Forest)
- ✅ Heuristic rule engine (22 rules)
- ✅ Lookalike domain detection (520+ brands)
- ✅ Brand impersonation detection (30+ brands)
- ✅ Threat intelligence integration (VirusTotal, AbuseIPDB, OpenPhish)
- ✅ Composite scoring with adaptive weighting
- ✅ Email analysis (bonus feature)
- ✅ Redis caching with fallback
- ✅ Comprehensive API documentation

### Frontend (React + Vite)
- ✅ Real-time URL analysis
- ✅ Visual threat score display
- ✅ Detailed breakdown of analysis components
- ✅ Historical scan results
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support

## 🔑 Configuration

### Backend (.env)
```env
# Optional: Add API keys for enhanced threat intelligence
VIRUSTOTAL_API_KEY=your_key_here
ABUSEIPDB_API_KEY=your_key_here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📈 Performance

- **API Latency**: < 200ms (target)
- **ML Inference**: < 50ms
- **Accuracy**: 99.3% (on training data)
- **AUC-ROC**: 0.9999

## 🛠️ Development

### Backend Development
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

### Frontend Development
```powershell
cd dashboard
npm run dev
```

### Run Tests
```powershell
# Backend tests
cd backend
pytest

# Frontend tests
cd dashboard
npm test
```

## 🚢 Production Deployment

### Backend (Docker)
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN python train_model.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Build)
```powershell
cd dashboard
npm run build
# Deploy dist/ folder to hosting service
```

## 🔒 Security Notes

- CORS configured for localhost in development
- Update `allow_origins` in production
- Add authentication/authorization for production use
- Store API keys in environment variables
- Use HTTPS in production

## 📝 API Documentation

Full API documentation available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

See individual component READMEs:
- Backend: `backend/README.md`
- Frontend: `dashboard/README.md`
- Extension: `extension/README.md`

## 📄 License

MIT License - see LICENSE file for details

---

**Built with:**
- Backend: FastAPI, scikit-learn, Redis
- Frontend: React, Vite, Tailwind CSS
- ML: Random Forest, Logistic Regression
- Threat Intel: VirusTotal, AbuseIPDB, OpenPhish
