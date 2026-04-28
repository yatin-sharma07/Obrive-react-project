# client-test.ps1
Write-Host "🔐 OBRIVE CLIENT API TEST" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

Write-Host "📝 Step 1: Logging in as Client..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/client/login" -Method POST -ContentType "application/json" -Body '{"clientId":"WEBSITE_847"}'

$token = $loginResponse.data.token
Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host "Token: $token`n" -ForegroundColor Gray

Write-Host "📝 Step 2: Fetching Dashboard..." -ForegroundColor Yellow
$dashboard = Invoke-RestMethod -Uri "http://localhost:5000/api/client/dashboard" -Method GET -Headers @{ Authorization = "Bearer $token" }

Write-Host "✅ Dashboard retrieved!" -ForegroundColor Green
Write-Host "`n📊 Dashboard Data:" -ForegroundColor Cyan
Write-Host ($dashboard | ConvertTo-Json -Depth 5)

Write-Host "`n📝 Step 3: Fetching Profile..." -ForegroundColor Yellow
$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/client/profile" -Method GET -Headers @{ Authorization = "Bearer $token" }

Write-Host "✅ Profile retrieved!" -ForegroundColor Green
Write-Host "`n👤 Profile Data:" -ForegroundColor Cyan
Write-Host ($profile | ConvertTo-Json -Depth 5)

Write-Host "`n🎉 All tests completed!" -ForegroundColor Gre