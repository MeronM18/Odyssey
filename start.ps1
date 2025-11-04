Write-Host "🚀 Starting Odyessia..." -ForegroundColor Cyan

Write-Host "`n📦 Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "📦 Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npx serve -l 3000"

Start-Sleep -Seconds 3

Write-Host "`n✅ Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3000/html/index.html"

Write-Host "`n🎉 Odyessia is running!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000/html/index.html" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C in each terminal to stop servers" -ForegroundColor Yellow

