# GitHub CLI 上传脚本
# 自动刷新环境变量并上传到GitHub

Write-Host "🚀 开始上传到 GitHub..." -ForegroundColor Green
Write-Host ""

# 刷新环境变量
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 验证 GitHub CLI
Write-Host "📋 检查 GitHub CLI..." -ForegroundColor Cyan
gh --version

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub CLI 未找到，请重启 PowerShell 后再试" -ForegroundColor Red
    Write-Host "或手动运行: RefreshEnv.cmd" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI 已就绪" -ForegroundColor Green
Write-Host ""

# 检查登录状态
Write-Host "🔐 检查 GitHub 登录状态..." -ForegroundColor Cyan
gh auth status

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "需要登录 GitHub，请按照提示操作：" -ForegroundColor Yellow
    Write-Host "1. 选择 GitHub.com" -ForegroundColor White
    Write-Host "2. 选择 HTTPS" -ForegroundColor White
    Write-Host "3. 选择 Login with a web browser" -ForegroundColor White
    Write-Host "4. 复制代码并在浏览器中粘贴" -ForegroundColor White
    Write-Host ""
    
    gh auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 登录失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ 已登录 GitHub" -ForegroundColor Green
Write-Host ""

# 创建仓库并推送
Write-Host "📦 创建 GitHub 仓库并推送代码..." -ForegroundColor Cyan
Write-Host "仓库名称: worldmonitor-enhanced" -ForegroundColor White
Write-Host "可见性: Public (公开)" -ForegroundColor White
Write-Host ""

gh repo create sjkncs/worldmonitor-enhanced `
    --public `
    --source=. `
    --description="Real-time global intelligence with Quant Trading AI Military Tracking and Energy Intelligence - 100 Percent Free Data Sources" `
    --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 成功上传到 GitHub！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 仓库地址: https://github.com/sjkncs/worldmonitor-enhanced" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 在浏览器中打开..." -ForegroundColor Cyan
    gh repo view --web
} else {
    Write-Host ""
    Write-Host "❌ 上传失败" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. 仓库已存在（删除后重试）" -ForegroundColor White
    Write-Host "2. 网络问题（检查 VPN）" -ForegroundColor White
    Write-Host "3. 权限问题（检查 GitHub token）" -ForegroundColor White
    Write-Host ""
    Write-Host "手动方法：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://github.com/new 创建仓库" -ForegroundColor White
    Write-Host "2. Run: git push -u origin main" -ForegroundColor White
}
