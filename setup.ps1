# PhishGuard AI - Setup Script
# Sets up both backend and frontend

Write-Host "🔧 Setting up PhishGuard AI..." -ForegroundColor Cyan
Write-Host ""

# Setup Backend
Write-Host "📦 Setting up Backend..." -ForegroundColor Green
Set-Location backend

if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\.venv\Scripts\Activate.ps1

Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt

Write-Host "Training ML models..." -ForegroundColor Yellow
python train_model.py

Set-Location ..

# Setup Frontend
Write-Host ""
Write-Host "📦 Setting up Frontend..." -ForegroundColor Green
Set-Location dashboard

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Creating .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item .env.example .env
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "  .\start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Or manually:" -ForegroundColor Yellow
Write-Host "  Terminal 1: cd backend && .\.venv\Scripts\python.exe -m uvicorn main:app --reload" -ForegroundColor White
Write-Host "  Terminal 2: cd dashboard && npm run dev" -ForegroundColor White
