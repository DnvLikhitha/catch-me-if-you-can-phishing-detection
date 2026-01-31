# PhishGuard AI - Full Stack Startup Script
# Starts both backend (FastAPI) and frontend (React + Vite)

Write-Host "🚀 Starting PhishGuard AI Full Stack..." -ForegroundColor Cyan
Write-Host ""

# Check if backend virtual environment exists
if (-not (Test-Path "backend\.venv")) {
    Write-Host "❌ Backend virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Yellow
    Write-Host "  python -m venv .venv" -ForegroundColor Yellow
    Write-Host "  .\.venv\Scripts\Activate.ps1" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

# Check if frontend node_modules exists
if (-not (Test-Path "dashboard\node_modules")) {
    Write-Host "❌ Frontend dependencies not installed!" -ForegroundColor Red
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  cd dashboard" -ForegroundColor Yellow
    Write-Host "  npm install" -ForegroundColor Yellow
    exit 1
}

# Start backend in new terminal
Write-Host "🔧 Starting Backend (FastAPI on port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend in new terminal
Write-Host "🎨 Starting Frontend (Vite on port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\dashboard'; npm run dev"

# Wait for frontend to start
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ PhishGuard AI is starting!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Gray
