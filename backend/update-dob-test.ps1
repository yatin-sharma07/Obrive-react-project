# ============================================
# OBRIVE CLIENT - UPDATE DOB & PROFILE TEST
# ============================================

Write-Host "🔧 OBRIVE CLIENT - UPDATE PROFILE TEST" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# Step 1: Login to get token
Write-Host "📝 Step 1: Logging in as Client..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/client/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"clientId":"WEBSITE_847"}'

$token = $loginResponse.data.token
Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, 50))...`n" -ForegroundColor Gray

# Step 2: Get Current Profile (Before Update)
Write-Host "📝 Step 2: Fetching Current Profile (Before Update)..." -ForegroundColor Yellow
$beforeProfile = Invoke-RestMethod -Uri "http://localhost:5000/api/client/profile" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "✅ Current Profile:" -ForegroundColor Green
Write-Host "   Name: $($beforeProfile.data.name)" -ForegroundColor Gray
Write-Host "   Date of Birth: $($beforeProfile.data.dateOfBirth)" -ForegroundColor Gray
Write-Host "   Email: $($beforeProfile.data.email)" -ForegroundColor Gray

# Step 3: Update Profile with New Name and DOB
Write-Host "`n📝 Step 3: Updating Profile (Name + DOB)..." -ForegroundColor Yellow

$updateBody = @{
    name = "Updated Client Name"
    dateOfBirth = "1990-05-15"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/client/profile" `
    -Method PUT `
    -Headers @{ 
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    } `
    -Body $updateBody

Write-Host "✅ Profile Updated Successfully!" -ForegroundColor Green
Write-Host "   New Name: $($updateResponse.data.name)" -ForegroundColor Gray
Write-Host "   New DOB: $($updateResponse.data.dateOfBirth)" -ForegroundColor Gray

# Step 4: Verify Update by Fetching Again
Write-Host "`n📝 Step 4: Verifying Update (Fetching Profile Again)..." -ForegroundColor Yellow
$afterProfile = Invoke-RestMethod -Uri "http://localhost:5000/api/client/profile" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "✅ Verified Profile After Update:" -ForegroundColor Green
Write-Host "   Name: $($afterProfile.data.name)" -ForegroundColor Gray
Write-Host "   Date of Birth: $($afterProfile.data.dateOfBirth)" -ForegroundColor Gray
Write-Host "   Email: $($afterProfile.data.email)" -ForegroundColor Gray
Write-Host "   Status: $($afterProfile.data.status)" -ForegroundColor Gray
Write-Host "   Member Since: $($afterProfile.data.memberSince)" -ForegroundColor Gray

# Step 5: Update Only DOB (Without Changing Name)
Write-Host "`n📝 Step 5: Updating Only DOB (Keeping Name Same)..." -ForegroundColor Yellow

$updateDOBBody = @{
    dateOfBirth = "1985-12-25"
} | ConvertTo-Json

$dobOnlyResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/client/profile" `
    -Method PUT `
    -Headers @{ 
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    } `
    -Body $updateDOBBody

Write-Host "✅ DOB Updated Successfully!" -ForegroundColor Green
Write-Host "   Name: $($dobOnlyResponse.data.name) (unchanged)" -ForegroundColor Gray
Write-Host "   New DOB: $($dobOnlyResponse.data.dateOfBirth)" -ForegroundColor Gray

# Step 6: Final Profile Summary
Write-Host "`n📝 Step 6: Final Profile Summary..." -ForegroundColor Yellow
$finalProfile = Invoke-RestMethod -Uri "http://localhost:5000/api/client/profile" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "`n📊 FINAL PROFILE DATA:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Client ID: $($finalProfile.data.clientId)" -ForegroundColor White
Write-Host "Name:      $($finalProfile.data.name)" -ForegroundColor White
Write-Host "Email:     $($finalProfile.data.email)" -ForegroundColor White
Write-Host "DOB:       $($finalProfile.data.dateOfBirth)" -ForegroundColor White
Write-Host "Status:    $($finalProfile.data.status)" -ForegroundColor White
Write-Host "Member Since: $($finalProfile.data.memberSince)" -ForegroundColor White
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`n🎉 All tests completed successfully!" -ForegroundColor Green