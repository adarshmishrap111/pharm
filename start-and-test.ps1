# PowerShell Script to Start Server and Open Pages
# Run this: .\start-and-test.ps1

Write-Host "🚀 Starting Pharmida Healthcare Backend..." -ForegroundColor Green
Write-Host ""

# Start the server in background
$serverProcess = Start-Process powershell -ArgumentList "-Command", "npm start" -PassThru -WindowStyle Normal

Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Server started! Opening pages..." -ForegroundColor Green
Write-Host ""

# Open multiple pages
Write-Host "📂 Opening Customer Pages..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 1

Write-Host "🔐 Opening Admin Login..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/admin-login.html"
Start-Sleep -Seconds 1

Write-Host "📊 Opening Admin Dashboard..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/admin-dashboard.html"

Write-Host ""
Write-Host "================================" -ForegroundColor Magenta
Write-Host "🎉 All Set!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "📝 Important URLs:" -ForegroundColor Yellow
Write-Host "   Homepage: http://localhost:3000"
Write-Host "   Admin Login: http://localhost:3000/admin-login.html"
Write-Host "   Admin Dashboard: http://localhost:3000/admin-dashboard.html"
Write-Host ""
Write-Host "🔑 Admin Password: admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  To stop server, close the server window or press Ctrl+C" -ForegroundColor Red
Write-Host ""

# Keep this window open
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
