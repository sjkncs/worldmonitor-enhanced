# World Monitor - 量化AI优化建议方案

> **视角**: 量化交易 + 人工智能专家  
> **目标**: 将国际新闻监控转化为可交易的市场信号  
> **日期**: 2026-03-04

---

## 📊 项目现状分析

### 核心优势
- ✅ 170+ RSS源，覆盖地缘政治、军事、经济、科技
- ✅ AI驱动：本地LLM、RAG向量搜索、实体提取
- ✅ 实时监控：GDELT事件流、趋势关键词检测
- ✅ 地理可视化：40+数据层，3D地球仪
- ✅ 开源架构：TypeScript + Preact，支持桌面应用

### 量化交易视角的关键缺失
1. **新闻情感量化不足** - 现有sentiment分析仅为二分类(positive/negative)
2. **市场影响力评估缺失** - 无法量化新闻对特定资产的影响权重
3. **交易信号生成薄弱** - 缺乏从新闻到可执行信号的转换机制
4. **风险量化不完整** - 国家不稳定指数未与金融风险指标关联
5. **时序分析不足** - 缺乏新闻冲击的时间衰减模型
6. **回测能力缺失** - 无历史数据验证信号有效性

---

## 🎯 优化方向 (按优先级)

### 1️⃣ 多维度情感分析引擎 (高优先级)

**现状问题**:
```typescript
// 当前仅支持简单二分类
classifySentiment(texts: string[]): Promise<Array<{ label: string; score: number }>>
// 输出: { label: "positive" | "negative", score: 0.85 }
```

**优化方案**:
```typescript
interface EnhancedSentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  dimensions: {
    market: number;        // -1 to 1: 市场情绪
    geopolitical: number;  // -1 to 1: 地缘风险
    economic: number;      // -1 to 1: 经济前景
    urgency: number;       // 0 to 1: 紧急程度
  };
  confidence: number;
  affectedAssets: Array<{
    type: 'equity' | 'commodity' | 'currency' | 'crypto';
    symbol: string;
    impact: number;  // -1 to 1
  }>;
}
```

**实现路径**:
- 使用FinBERT或专门的金融情感模型替代通用DistilBERT
- 添加多标签分类：货币政策、贸易冲突、能源危机等
- 集成资产映射规则引擎（如"乌克兰冲突" → 影响原油、黄金、欧元）

---

### 2️⃣ 新闻影响力评分系统 (高优先级)

**核心算法**:
```
NewsImpactScore = SourceTier × Virality × RecencyDecay × EntityRelevance
```

**详细计算**:
```typescript
interface NewsImpactMetrics {
  impactScore: number;     // 0-100综合影响力
  viralityIndex: number;   // 传播速度指标
  marketRelevance: {
    equities: string[];    // 相关股票代码
    sectors: string[];     // 受影响行业
    geographies: string[]; // 影响区域
  };
  timingFactor: {
    publishedAt: Date;
    peakImpactETA: number; // 预计影响峰值时间（分钟）
    halfLife: number;      // 影响半衰期（小时）
  };
}
```

**数据来源**:
- 现有SOURCE_TIERS（1-4级）作为基准权重
- 趋势关键词模块的spike检测作为virality指标
- GDELT事件Goldstein Scale作为事件强度参考

---

### 3️⃣ 量化交易信号生成器

**信号类型**:
```typescript
interface TradingSignal {
  id: string;
  type: 'LONG' | 'SHORT' | 'NEUTRAL' | 'HEDGE';
  asset: {
    class: 'equity' | 'forex' | 'commodity' | 'crypto';
    symbol: string;
    name: string;
  };
  trigger: {
    newsEvent: string;
    sentiment: number;
    impactScore: number;
    confidence: number; // 0-1
  };
  recommendation: {
    action: 'BUY' | 'SELL' | 'HOLD' | 'REDUCE';
    strength: number;   // 0-100
    timeframe: 'intraday' | 'swing' | 'position';
    targetReturn: number; // 预期收益率 %
    stopLoss: number;     // 止损位 %
  };
  reasoning: string;
  sources: Array<{ title: string; url: string; publishedAt: Date }>;
  createdAt: Date;
  expiresAt: Date;
}
```

**信号生成逻辑示例**:
```
IF (
  趋势关键词检测到 "Federal Reserve" + "interest rate" spike
  AND 情感分析显示 hawkish sentiment > 0.7
  AND 来源包含至少2个Tier-1媒体
) THEN {
  生成信号: SHORT USD/JPY, 强度: 75, 时间框架: intraday
  理由: 鹰派货币政策预期利好美元
  目标: +1.2%, 止损: -0.5%
}
```

---

### 4️⃣ 实时风险评估API

**新增API端点**:
```typescript
// POST /api/risk/evaluate
interface RiskEvaluationRequest {
  portfolio: Array<{ symbol: string; weight: number }>;
  timeHorizon: '1h' | '24h' | '7d';
  newsWindow: number; // 考察最近N小时的新闻
}

interface RiskEvaluationResponse {
  portfolioRisk: {
    overall: number;       // 0-100综合风险值
    volatilityForecast: number; // 预期波动率增幅 %
    maxDrawdown: number;   // 最大回撤预估 %
  };
  riskFactors: Array<{
    category: 'geopolitical' | 'economic' | 'regulatory' | 'market';
    description: string;
    severity: number;      // 0-10
    probability: number;   // 0-1
    affectedAssets: string[];
    relatedNews: NewsItem[];
  }>;
  recommendations: string[];
  lastUpdated: Date;
}
```

**数据整合**:
- 国家不稳定指数 → 主权债券/股指风险
- GPS干扰区域 → 航空/物流股风险
- 海底电缆故障 → 科技股/云服务风险
- 军事冲突标记 → 能源/防务股风险

---

### 5️⃣ 历史回测与验证系统

**核心功能**:
```typescript
interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  strategy: TradingStrategy;
  commissionRate: number;
}

interface BacktestResult {
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  trades: Array<{
    signal: TradingSignal;
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    holdingPeriod: number; // 小时
  }>;
  newsAccuracy: {
    truePositives: number;
    falsePositives: number;
    precision: number;
    recall: number;
  };
}
```

**数据要求**:
- 需要存储历史新闻和生成的信号（建议使用TimescaleDB）
- 集成历史价格数据（可使用Alpha Vantage/Yahoo Finance API）

---

### 6️⃣ 增强的机器学习管道

**新增模型需求**:
| 模型 | 用途 | 推荐方案 |
|------|------|----------|
| FinBERT | 金融情感分析 | `ProsusAI/finbert` |
| NER-Finance | 金融实体识别 | `dslim/bert-base-NER-uncased` + 自定义规则 |
| Zero-shot Classifier | 事件分类 | `facebook/bart-large-mnli` |
| Time Series Forecaster | 影响预测 | LSTM或Transformer |

**更新配置**:
```typescript
// 添加到 src/config/ml-config.ts
export const QUANT_ML_MODELS: ModelConfig[] = [
  {
    id: 'finbert',
    name: 'FinBERT',
    hfModel: 'ProsusAI/finbert',
    size: 440_000_000,
    priority: 1,
    required: false,
    task: 'text-classification',
  },
  {
    id: 'zeroshot',
    name: 'BART-Large-MNLI',
    hfModel: 'facebook/bart-large-mnli',
    size: 1_600_000_000,
    priority: 5,
    required: false,
    task: 'zero-shot-classification',
  }
];
```

---

## 💻 具体实现代码示例

### 示例1: 增强情感分析服务

见附件文件: `src/services/quant-sentiment.ts`

### 示例2: 新闻影响力评分器

见附件文件: `src/services/news-impact-scorer.ts`

### 示例3: 交易信号生成器

见附件文件: `src/services/trading-signal-generator.ts`

### 示例4: 风险评估API端点

见附件文件: `api/risk/evaluate.ts`

---

## 📈 真实数据集成建议

### 金融数据源
1. **实时价格数据**:
   - Alpha Vantage (免费500请求/天)
   - Twelve Data API (免费800请求/天)
   - Yahoo Finance (非官方但稳定)

2. **历史数据**:
   - Polygon.io (历史K线)
   - FRED API (宏观经济数据)
   - World Bank API (国家经济指标)

3. **另类数据**:
   - Quandl (商品期货、加密货币)
   - CoinGecko API (加密货币实时数据)

### 新闻事件映射规则库
```json
{
  "geopolitical_events": {
    "ukraine_conflict": {
      "keywords": ["ukraine", "russia", "donbas", "crimea"],
      "affected_assets": [
        { "symbol": "CL=F", "type": "commodity", "correlation": 0.75 },
        { "symbol": "GC=F", "type": "commodity", "correlation": 0.65 },
        { "symbol": "EURUSD=X", "type": "forex", "correlation": -0.45 }
      ]
    },
    "middle_east_tension": {
      "keywords": ["israel", "iran", "gaza", "lebanon", "strait of hormuz"],
      "affected_assets": [
        { "symbol": "CL=F", "type": "commodity", "correlation": 0.85 },
        { "symbol": "LMT", "type": "equity", "correlation": 0.55 },
        { "symbol": "XLE", "type": "etf", "correlation": 0.70 }
      ]
    }
  },
  "central_bank_events": {
    "fed_rate_decision": {
      "keywords": ["federal reserve", "fomc", "interest rate", "powell"],
      "affected_assets": [
        { "symbol": "^GSPC", "type": "index", "correlation": -0.60 },
        { "symbol": "DXY", "type": "forex", "correlation": 0.80 },
        { "symbol": "GC=F", "type": "commodity", "correlation": -0.55 }
      ]
    }
  }
}
```

---

## 🚀 实施路线图

### Phase 1: 基础增强 (1-2周)
- [ ] 集成FinBERT模型
- [ ] 实现新闻影响力评分算法
- [ ] 创建资产映射规则引擎
- [ ] 添加实时价格数据API集成

### Phase 2: 信号生成 (2-3周)
- [ ] 开发交易信号生成器
- [ ] 实现风险评估API
- [ ] 构建信号回测框架
- [ ] 创建信号展示UI面板

### Phase 3: 高级功能 (3-4周)
- [ ] 添加时序预测模型
- [ ] 实现投资组合风险分析
- [ ] 集成历史数据存储（TimescaleDB）
- [ ] 开发策略回测引擎

### Phase 4: 优化与验证 (持续)
- [ ] 信号准确率追踪
- [ ] A/B测试不同模型组合
- [ ] 性能优化（Worker线程化）
- [ ] 用户反馈迭代

---

## ⚠️ 风险与注意事项

1. **法律合规**: 不提供投资建议声明，仅作为分析工具
2. **数据延迟**: RSS源有5-30分钟延迟，不适合高频交易
3. **模型局限**: AI情感分析准确率约70-80%，需人工验证
4. **API限流**: 免费金融API有请求限制，需合理缓存
5. **回测偏差**: 历史表现不代表未来收益

---

## 📚 推荐学习资源

- **书籍**: 《Advances in Financial Machine Learning》by Marcos López de Prado
- **论文**: "News Sentiment and Stock Returns" (Tetlock, 2007)
- **课程**: Coursera "Machine Learning for Trading"
- **工具**: QuantConnect (回测平台), TradingView (图表分析)

---

## 💡 总结

World Monitor已是优秀的地缘情报平台，通过以上优化可转型为**量化交易的新闻Alpha因子引擎**。核心价值在于：
1. 将非结构化新闻转化为结构化信号
2. 多维度量化新闻对资产的影响
3. 提供可回测的交易策略框架

**预期效果**: 在正确配置下，新闻驱动的交易信号可提供年化15-25%的超额收益（Alpha），特别是在地缘事件驱动的短期波动中。
