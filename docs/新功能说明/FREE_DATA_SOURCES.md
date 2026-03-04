# 🆓 完全免费数据源方案

## 核心原则：零成本、高效率

---

## 1️⃣ 量化交易 - 免费方案

### 新闻数据源（免费）

#### A. RSS订阅（现有，无限额）
- ✅ Bloomberg RSS
- ✅ Reuters RSS  
- ✅ CNBC RSS
- ✅ 完全免费，无限制

#### B. Twitter/X（免费层）
- **免费限额**: 500k推文/月
- **申请**: https://developer.twitter.com
- **足够用于**: 中小规模监控
- **成本**: $0

#### C. News API（免费层）
- **免费限额**: 100请求/日 = 3000/月
- **申请**: https://newsapi.org
- **覆盖**: CNN, Fox, Bloomberg
- **成本**: $0

### 金融数据源（免费）

#### A. Yahoo Finance API
```typescript
// 完全免费，无限额
const url = 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL';
```
- ✅ 实时股价（15分钟延迟）
- ✅ 历史数据
- ✅ 无需API密钥

#### B. Alpha Vantage（免费层）
- **免费限额**: 500请求/日
- **申请**: https://www.alphavantage.co
- **数据**: 股票、外汇、加密货币
- **成本**: $0

#### C. CoinGecko（免费）
```typescript
// 加密货币数据，完全免费
const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin';
```

---

## 2️⃣ 军事追踪 - 免费方案

### OpenSky Network（完全免费）
```typescript
import { fetchOpenSkyMilitary } from '@/services/military-tracking';

// 无需API密钥
const aircraft = await fetchOpenSkyMilitary();
```

**优势**:
- ✅ 完全免费
- ✅ 无限制调用
- ✅ 全球军机覆盖
- ✅ 10秒更新

**成本**: $0

---

## 3️⃣ 能源情报 - 免费方案 🆕

### A. 能源价格API（免费）

#### EIA（美国能源信息署）
```typescript
// 免费，需注册API密钥
const url = 'https://api.eia.gov/v2/petroleum/pri/spt/data/';
```
- ✅ 原油价格（WTI, Brent）
- ✅ 天然气价格
- ✅ 电力数据
- **申请**: https://www.eia.gov/opendata/
- **成本**: $0

#### Oil Price API
```typescript
// 免费层：500请求/月
const url = 'https://api.oilpriceapi.com/v1/prices/latest';
```

### B. 能源新闻源（免费RSS）

**石油/天然气**:
- Oil & Gas Journal RSS
- Rigzone RSS
- Energy Voice RSS

**新能源**:
- Renewable Energy World RSS
- PV Magazine RSS
- CleanTechnica RSS

**电力**:
- Power Engineering RSS
- Utility Dive RSS

### C. 卫星图像（免费）

#### Sentinel Hub（欧空局）
```typescript
// 监测油田、管道、LNG终端
const url = 'https://services.sentinel-hub.com/ogc/wms/';
```
- ✅ 免费账号
- ✅ 10-60米分辨率
- ✅ 可检测大型设施

---

## 4️⃣ 完全免费组合方案

### 推荐配置（月成本：$0）

```
新闻监控:
├─ RSS订阅（无限制）
├─ Twitter免费层（500k/月）
└─ News API免费层（100/日）

金融数据:
├─ Yahoo Finance（无限制）
├─ Alpha Vantage（500/日）
└─ CoinGecko（无限制）

军事追踪:
└─ OpenSky Network（无限制）

能源情报:
├─ EIA API（无限制）
├─ 能源RSS（无限制）
└─ Sentinel Hub（免费账号）
```

### 数据量估算

**每日可获取**:
- 新闻: 5000+ 条
- 推文: 16,000+ 条
- 价格更新: 500+ 次
- 军机位置: 8,640+ 次（10秒间隔）
- 能源数据: 无限次

**总成本**: **$0/月**

---

## 5️⃣ 免费替代方案列表

### 如果免费层不够用

**Twitter替代**:
- ❌ Twitter API付费 ($100/月)
- ✅ Nitter镜像站（网页爬取，免费）
- ✅ snscrape库（Python爬虫，免费）

**News API替代**:
- ❌ News API付费 ($449/月)
- ✅ RSS聚合器（免费）
- ✅ 自建爬虫（免费但需开发）

**ADS-B替代**:
- ❌ ADS-B Exchange ($30/月)
- ✅ OpenSky Network（免费）
- ✅ ADSBHub（免费，需贡献数据）

---

## 6️⃣ 免费方案优化技巧

### A. 智能缓存
```typescript
// 避免重复请求
const cache = new Map();
const TTL = 60000; // 1分钟缓存

async function getCachedData(key, fetchFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < TTL) {
    return cached.data;
  }
  const data = await fetchFn();
  cache.set(key, { data, time: Date.now() });
  return data;
}
```

### B. 请求限流
```typescript
// 避免超出免费限额
import pLimit from 'p-limit';

const limit = pLimit(5); // 最多5个并发请求

const promises = urls.map(url =>
  limit(() => fetch(url))
);
```

### C. 多源聚合
```typescript
// 如果单一源不够，聚合多个免费源
const allData = await Promise.all([
  fetchYahooFinance(),
  fetchAlphaVantage(),
  fetchCoinGecko(),
]);
```

---

## 7️⃣ 免费vs付费对比

| 功能 | 免费方案 | 付费方案 | 推荐 |
|------|----------|----------|------|
| **新闻监控** | RSS + Twitter免费层 | News API Pro | 免费够用 ✅ |
| **金融数据** | Yahoo + Alpha Vantage | Bloomberg Terminal | 免费够用 ✅ |
| **军机追踪** | OpenSky Network | ADS-B Exchange | 免费够用 ✅ |
| **能源数据** | EIA + RSS | Platts/Argus | 免费够用 ✅ |
| **高频交易** | ❌ 延迟15分钟 | ✅ 实时 | 需付费 |
| **历史回测** | ✅ 免费历史数据 | ✅ 更全面 | 免费够用 ✅ |

**结论**: 对于95%的用例，**免费方案完全够用**

---

## 8️⃣ 快速开始

### 步骤1: 注册免费账号（5分钟）

```bash
# 1. Twitter Developer
https://developer.twitter.com → 创建App → 获取Bearer Token

# 2. News API
https://newsapi.org/register → 复制API Key

# 3. EIA（能源数据）
https://www.eia.gov/opendata/register.php → 获取API Key

# 4. Alpha Vantage
https://www.alphavantage.co/support/#api-key → 获取密钥
```

### 步骤2: 配置环境变量

```env
# .env
TWITTER_BEARER_TOKEN=xxx
NEWS_API_KEY=xxx
EIA_API_KEY=xxx
ALPHA_VANTAGE_KEY=xxx
```

### 步骤3: 开始使用

```typescript
// 全部免费！
import { fetchOpenSkyMilitary } from '@/services/military-tracking';
import { fetchTwitterFinancialSentiment } from '@/services/media-apis';
import { fetchEnergyPrices } from '@/services/energy-intelligence';

// 军机追踪
const aircraft = await fetchOpenSkyMilitary();

// Twitter舆情
const tweets = await fetchTwitterFinancialSentiment(TWITTER_TOKEN);

// 能源价格
const energy = await fetchEnergyPrices(EIA_KEY);
```

---

## ✨ 总结

**完全免费方案可实现**:
- ✅ 实时新闻监控（5000+条/日）
- ✅ 金融数据追踪（无限次）
- ✅ 全球军机追踪（实时）
- ✅ 能源价格监控（实时）
- ✅ AI情感分析（本地模型）
- ✅ 量化交易信号

**月成本**: **$0**

**适合**: 个人、研究、中小规模应用

**何时需要付费**:
- 高频交易（秒级数据）
- 极大规模（百万级请求/日）
- 专业级Bloomberg数据

**对于你的需求**: **免费方案100%满足！**
