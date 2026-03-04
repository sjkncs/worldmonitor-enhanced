# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Starting GitHub upload process..." -ForegroundColor Green

# Check GitHub CLI
Write-Host "Checking GitHub CLI..." -ForegroundColor Cyan
gh --version

if ($LASTEXITCODE -ne 0) {
    Write-Host "GitHub CLI not found. Please restart PowerShell." -ForegroundColor Red
    exit 1
}

Write-Host "GitHub CLI ready!" -ForegroundColor Green

# Check login status
Write-Host "Checking GitHub login status..." -ForegroundColor Cyan
gh auth status

if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to GitHub..." -ForegroundColor Yellow
    gh auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Logged in to GitHub!" -ForegroundColor Green

# Create repo and push
Write-Host "Creating GitHub repository and pushing code..." -ForegroundColor Cyan

$desc = "Real-time global intelligence with Quant Trading AI Military Tracking and Energy Intelligence"

gh repo create sjkncs/worldmonitor-enhanced --public --source=. --description $desc --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Uploaded to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/sjkncs/worldmonitor-enhanced" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening in browser..." -ForegroundColor Cyan
    gh repo view --web
} else {
    Write-Host ""
    Write-Host "Upload failed!" -ForegroundColor Red
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "1. Repository already exists" -ForegroundColor White
    Write-Host "2. Network issue" -ForegroundColor White
    Write-Host "3. Permission issue" -ForegroundColor White
}
