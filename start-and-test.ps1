# PowerShell Script to Start Server and Open Pages
# Run this: .\start-and-test.ps1

Write-Host "🚀 Starting Pharmida Healthcare Backend..." -ForegroundColor Green

# Kill any existing processes on port 3000
Write-Host "🧹 Cleaning up port 3000..." -ForegroundColor Yellow
$processes = netstat -ano | findstr :3000
if ($processes) {
    $processes | ForEach-Object {
        $pid = ($_ -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } catch {}
        }
    }
}

# Start the server in background
$serverProcess = Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm start" -PassThru -WindowStyle Minimized

Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 6

# Test server connection
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Server is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Server failed to start" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🧪 Opening Test Page First..." -ForegroundColor Blue
Start-Process "http://localhost:3000/test-upload.html"
Start-Sleep -Seconds 3

Write-Host "📂 Opening Customer Pages..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 1

Write-Host "🔐 Opening Admin Login..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/admin-login.html"
Start-Sleep -Seconds 1

Write-Host "📊 Opening Admin Dashboard..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/admin-dashboard.html"
Start-Sleep -Seconds 1

Write-Host "📤 Opening Product Upload..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/product-upload.html"

Write-Host ""
Write-Host "================================" -ForegroundColor Magenta
Write-Host "🎉 Deployment Ready!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "🧪 Test All Features:" -ForegroundColor Yellow
Write-Host "   🔬 Test Page: http://localhost:3000/test-upload.html" -ForegroundColor White
Write-Host "   (Use this to verify all APIs are working)" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Important URLs:" -ForegroundColor Yellow
Write-Host "   🏠 Homepage: http://localhost:3000"
Write-Host "   🔐 Admin Login: http://localhost:3000/admin-login.html"
Write-Host "   📊 Admin Dashboard: http://localhost:3000/admin-dashboard.html"
Write-Host "   📤 Product Upload: http://localhost:3000/product-upload.html"
Write-Host "   🛒 Cart: http://localhost:3000/cart.html"
Write-Host ""
Write-Host "🔑 Admin Credentials:" -ForegroundColor Yellow
Write-Host "   Username: admin"
Write-Host "   Password: admin123"
Write-Host ""
Write-Host "✅ Project Structure:" -ForegroundColor Green
Write-Host "   📁 backend/ - Server files & APIs"
Write-Host "   📁 frontend/ - All HTML/CSS/JS files"
Write-Host "   📁 docs/ - Documentation"
Write-Host "   🔧 Root package.json for workspace management"
Write-Host ""
Write-Host "🚀 Ready for deployment to Render/Vercel/Railway!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  To stop server, close the server window or press Ctrl+C" -ForegroundColor Red

# Keep this window open
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
