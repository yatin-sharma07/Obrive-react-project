$BaseUrl = "http://localhost:5000"

Write-Host "Step 1: Login with HR credentials" -ForegroundColor Cyan
$loginBody = '{"email":"hr@example.com","password":"12345"}'
$loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/hr/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.data.token

Write-Host "Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Green
Write-Host "`nLogin Response:" -ForegroundColor Green
$loginResponse | ConvertTo-Json | Write-Host

Write-Host "`nStep 2: Update HR profile with bio, DOB, and phone" -ForegroundColor Cyan
$updateBody = @{
    name = "HR Administrator"
    bio = "Experienced HR professional managing employee relations"
    dateOfBirth = "1985-06-15"
    phone = "+1234567890"
} | ConvertTo-Json

Write-Host "Update payload: $updateBody" -ForegroundColor Yellow
$updateResponse = Invoke-RestMethod -Uri "$BaseUrl/api/hr/profile" `
    -Method PUT `
    -Headers @{ Authorization = "Bearer $token" } `
    -ContentType "application/json" `
    -Body $updateBody

Write-Host "`nUpdate Response:" -ForegroundColor Green
$updateResponse | ConvertTo-Json | Write-Host

Write-Host "`nStep 3: Get updated HR profile" -ForegroundColor Cyan
$profileResponse = Invoke-RestMethod -Uri "$BaseUrl/api/hr/profile" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "`nProfile Response:" -ForegroundColor Green
$profileResponse | ConvertTo-Json | Write-Host

Write-Host "`nAll HR profile operations completed successfully!" -ForegroundColor Green
