# 📋 GitHub Topics 和 Release 创建指南

## 🏷️ Topics（标签）配置

### 如何添加 Topics

1. 访问你的仓库页面：https://github.com/sjkncs/worldmonitor-enhanced
2. 点击右侧的 ⚙️ **Settings** (齿轮图标，在 About 旁边)
3. 在 "Topics" 部分，逐个添加以下标签
4. 每添加一个，按回车键确认

### 推荐的 Topics（按优先级排序）

**核心功能标签（必选）：**
```
osint
intelligence
dashboard
quantitative-trading
military-tracking
energy-intelligence
real-time
```

**技术栈标签（必选）：**
```
typescript
preact
javascript
webgl
deckgl
maplibre
```

**AI/ML 标签（推荐）：**
```
finbert
lstm
ai
machine-learning
sentiment-analysis
deep-learning
onnx
```

**数据源标签（推荐）：**
```
free-data
opensky-network
yahoo-finance
open-source
```

**领域标签（可选）：**
```
geospatial
news-aggregation
trading-signals
financial-analysis
data-visualization
3d-visualization
```

### 完整 Topics 列表（复制使用）

```
osint, intelligence, dashboard, quantitative-trading, military-tracking, 
energy-intelligence, finbert, lstm, ai, machine-learning, real-time, 
typescript, preact, deckgl, webgl, geospatial, sentiment-analysis, 
trading-signals, free-data, opensky-network, yahoo-finance, financial-analysis, 
maplibre, javascript, open-source, data-visualization, deep-learning, onnx
```

**注意：** GitHub 限制最多 20 个 topics，选择最相关的即可。

---

## 🎉 创建 Release v2.6.0

### 方法一：GitHub 网站（推荐）

#### 第1步：进入 Releases 页面

1. 访问：https://github.com/sjkncs/worldmonitor-enhanced/releases
2. 点击 **Create a new release** 按钮（绿色）

#### 第2步：填写 Release 信息

**Tag version:**
```
v2.6.0
```

**Release title:**
```
v2.6.0 - Quant Trading AI + Military Tracking + Energy Intelligence
```

**Description:** 复制 `RELEASE_v2.6.0.md` 的内容

或者使用这个简化版：

```markdown
## 🎉 Major Update: Three New Intelligence Systems

### 🆕 New Features

#### 📊 Quantitative Trading AI
- FinBERT sentiment analysis (75-85% accuracy)
- LSTM price prediction & GARCH volatility modeling
- Automated BUY/SELL/HOLD signals
- Comprehensive backtesting framework

#### 🛩️ Military Asset Tracking
- Real-time aircraft tracking (10-second updates)
- OpenSky Network integration (100% free)
- Global coverage (US, Russia, China)
- 6-hour trajectory prediction

#### ⚡ Energy Intelligence
- Real-time WTI/Brent/NG price monitoring
- <5-minute anomaly alerts
- Yahoo Finance + EIA integration
- Supply disruption monitoring

### 💰 Cost: $0/month
All features use 100% free data sources!

### 📚 Documentation
See [docs/新功能说明/](./docs/新功能说明/) for complete guides.

### 🚀 Quick Start
```bash
git clone https://github.com/sjkncs/worldmonitor-enhanced.git
cd worldmonitor-enhanced
npm install --legacy-peer-deps --ignore-scripts
npm run dev
```

Visit http://localhost:3000/test-new-features.html to test!

**Full Release Notes:** [RELEASE_v2.6.0.md](./RELEASE_v2.6.0.md)
```

#### 第3步：发布

1. 勾选 **Set as the latest release** ✅
2. 点击 **Publish release** 按钮（绿色）

✅ **完成！** Release 已创建

---

### 方法二：GitHub CLI

如果你已经登录 GitHub CLI：

```powershell
cd C:\Users\Lenovo\Downloads\worldmonitor-main

# 创建 tag
git tag -a v2.6.0 -m "Version 2.6.0 - Quant Trading AI + Military Tracking + Energy Intelligence"

# 推送 tag
git push origin v2.6.0

# 创建 Release
gh release create v2.6.0 `
  --title "v2.6.0 - Quant Trading AI + Military Tracking + Energy Intelligence" `
  --notes-file RELEASE_v2.6.0.md `
  --latest
```

---

### 方法三：Git + 网站结合

```powershell
cd C:\Users\Lenovo\Downloads\worldmonitor-main

# 1. 创建并推送 tag
git tag -a v2.6.0 -m "Version 2.6.0 - Major feature update"
git push origin v2.6.0

# 2. 访问网站
# https://github.com/sjkncs/worldmonitor-enhanced/releases/new
# 选择刚创建的 tag: v2.6.0
# 填写标题和描述
```

---

## 📝 Release 检查清单

创建 Release 后，确保以下内容正确：

- [ ] Tag 版本: `v2.6.0`
- [ ] 标题包含三大功能
- [ ] 描述详细且格式正确
- [ ] 标记为 "Latest release"
- [ ] 所有链接可点击
- [ ] 文档链接有效

---

## 🎨 美化 About 区域

在仓库主页右侧：

### Website（可选）
```
https://worldmonitor.app
```

### Description
```
Real-time global intelligence dashboard with AI-powered Quant Trading (75-85% accuracy), Military Aircraft Tracking (10s updates), and Energy Intelligence (<5min alerts). 100% free data sources.
```

### Topics
添加前面列出的 topics

---

## 📊 验证步骤

### 1. 检查 Topics
访问：https://github.com/sjkncs/worldmonitor-enhanced
- ✅ Topics 显示在右侧 About 区域
- ✅ 点击 topic 可搜索类似项目

### 2. 检查 Release
访问：https://github.com/sjkncs/worldmonitor-enhanced/releases
- ✅ v2.6.0 显示为 "Latest"
- ✅ Release notes 格式正确
- ✅ 下载链接可用

### 3. 检查主页
- ✅ README 正确显示
- ✅ 描述清晰
- ✅ Topics 完整
- ✅ Star/Fork 按钮可用

---

## 🚀 后续推广

### 社交媒体分享模板

**Twitter/X:**
```
🚀 Just released World Monitor Enhanced v2.6.0!

✨ New Features:
📊 AI Quant Trading (75-85% accuracy)
🛩️ Military Aircraft Tracking (10s updates)
⚡ Energy Intelligence (<5min alerts)

💰 100% FREE data sources | $0/month

🔗 https://github.com/sjkncs/worldmonitor-enhanced

#OSINT #Trading #AI #OpenSource
```

**Reddit (r/OSINT, r/algotrading):**
```
[Project] World Monitor Enhanced v2.6.0 - Free OSINT + AI Trading + Military Tracking

I've added three major features to World Monitor:

1. Quantitative Trading AI with FinBERT (75-85% accuracy)
2. Real-time Military Aircraft Tracking (OpenSky Network)
3. Energy Intelligence System (<5min alerts)

Everything uses 100% free data sources - no API costs!

GitHub: https://github.com/sjkncs/worldmonitor-enhanced
Live demo: https://worldmonitor.app

Would love your feedback!
```

### 推荐平台
- Reddit: r/OSINT, r/algotrading, r/SideProject
- Hacker News: https://news.ycombinator.com/submit
- Product Hunt: https://www.producthunt.com/posts/create

---

## 🎯 快速命令参考

```powershell
# 添加所有更改并提交
git add .
git commit -m "Add release notes and topics guide"
git push origin main

# 创建并推送 tag
git tag -a v2.6.0 -m "Version 2.6.0"
git push origin v2.6.0

# 使用 GitHub CLI 创建 release
gh release create v2.6.0 --title "v2.6.0 - Major Update" --notes-file RELEASE_v2.6.0.md
```

---

<p align="center">
  <strong>🎊 完成这些步骤后，你的项目就完美了！</strong>
</p>
