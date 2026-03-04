/**
 * Quantitative Sentiment Analysis Service
 * 量化情感分析 - 为金融交易提供多维度情感评分
 */

import { mlWorker } from './ml-worker';

export interface FinancialSentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  dimensions: {
    market: number;        // -1 to 1: 市场情绪
    geopolitical: number;  // -1 to 1: 地缘风险
    economic: number;      // -1 to 1: 经济前景
    urgency: number;       // 0 to 1: 紧急程度
  };
  confidence: number;      // 0 to 1
  affectedAssets: Array<{
    type: 'equity' | 'commodity' | 'currency' | 'crypto' | 'index';
    symbol: string;
    name: string;
    impact: number;        // -1 (极度利空) to 1 (极度利好)
    confidence: number;
  }>;
  keywords: string[];
  reasoning: string;
}

// 金融关键词模式匹配规则
const FINANCIAL_PATTERNS = {
  // 市场情绪关键词
  bullish: [
    /\b(rally|surge|soar|jump|gain|rise|climb|advance|bullish|optimistic)\b/i,
    /\b(record\s+high|all[-\s]time\s+high|breakthrough|boom)\b/i,
    /\b(beat\s+expectations|outperform|exceed)\b/i,
  ],
  bearish: [
    /\b(plunge|crash|tumble|fall|decline|drop|slump|bearish|pessimistic)\b/i,
    /\b(recession|crisis|collapse|turmoil|panic|selloff|sell[-\s]off)\b/i,
    /\b(miss\s+expectations|underperform|disappoint)\b/i,
  ],
  
  // 地缘政治风险
  geopoliticalRisk: [
    /\b(war|conflict|invasion|attack|strike|missile|military|sanction)\b/i,
    /\b(tension|dispute|confrontation|crisis|escalate|threat)\b/i,
    /\b(russia|ukraine|china|taiwan|israel|iran|north\s+korea)\b/i,
  ],
  
  // 经济指标
  economicPositive: [
    /\b(growth|expansion|recovery|rebound|improvement|strong\s+data)\b/i,
    /\b(employment|jobs\s+growth|gdp\s+rise|inflation\s+falls)\b/i,
    /\b(rate\s+cut|stimulus|easing|dovish)\b/i,
  ],
  economicNegative: [
    /\b(slowdown|contraction|downturn|weakness|deterioration)\b/i,
    /\b(unemployment|job\s+losses|gdp\s+falls|inflation\s+surge)\b/i,
    /\b(rate\s+hike|tightening|hawkish|restrictive)\b/i,
  ],
  
  // 紧急程度
  urgency: [
    /\b(breaking|urgent|emergency|immediate|now|just\s+in|alert)\b/i,
    /\b(sudden|unexpected|shock|surprise)\b/i,
  ],
};

// 资产影响映射规则
const ASSET_IMPACT_RULES = {
  commodities: {
    oil: {
      keywords: ['oil', 'crude', 'opec', 'energy', 'petroleum', 'middle east', 'russia'],
      symbols: ['CL=F', 'BZ=F', 'USO', 'XLE'],
      riskMultiplier: 0.8,
    },
    gold: {
      keywords: ['gold', 'safe haven', 'uncertainty', 'inflation', 'dollar weakness'],
      symbols: ['GC=F', 'GLD', 'IAU'],
      riskMultiplier: 0.7,
    },
  },
  forex: {
    usd: {
      keywords: ['dollar', 'federal reserve', 'fed', 'us economy', 'treasury'],
      symbols: ['DXY', 'EURUSD=X', 'USDJPY=X'],
      riskMultiplier: 0.6,
    },
    safe_haven: {
      keywords: ['crisis', 'risk off', 'uncertainty', 'war'],
      symbols: ['JPY=X', 'CHF=X'],
      riskMultiplier: 0.75,
    },
  },
  equities: {
    tech: {
      keywords: ['ai', 'technology', 'semiconductor', 'chip', 'software', 'cloud'],
      symbols: ['^IXIC', 'QQQ', 'NVDA', 'MSFT', 'AAPL'],
      riskMultiplier: 0.9,
    },
    defense: {
      keywords: ['military', 'defense', 'war', 'conflict', 'weapon'],
      symbols: ['LMT', 'RTX', 'BA', 'NOC', 'GD'],
      riskMultiplier: 0.85,
    },
  },
};

/**
 * 分析文本并返回多维度金融情感
 */
export async function analyzeFinancialSentiment(text: string): Promise<FinancialSentiment> {
  const lowerText = text.toLowerCase();
  
  // 1. 基础情感分析（如果ML Worker可用）
  let baseSentiment = 0;
  let baseConfidence = 0.5;
  
  if (mlWorker.isAvailable) {
    try {
      const results = await mlWorker.classifySentiment([text]);
      if (results && results.length > 0) {
        const result = results[0]!;
        baseSentiment = result.label === 'positive' ? result.score : -result.score;
        baseConfidence = result.score;
      }
    } catch (error) {
      console.warn('[QuantSentiment] ML sentiment failed, using rule-based:', error);
    }
  }
  
  // 2. 多维度评分
  const dimensions = {
    market: calculateMarketSentiment(lowerText, baseSentiment),
    geopolitical: calculateGeopoliticalRisk(lowerText),
    economic: calculateEconomicSentiment(lowerText),
    urgency: calculateUrgency(lowerText),
  };
  
  // 3. 综合情感判断
  const overallScore = (dimensions.market * 0.4 + dimensions.economic * 0.3 - dimensions.geopolitical * 0.3);
  const overall: 'bullish' | 'bearish' | 'neutral' = 
    overallScore > 0.15 ? 'bullish' : 
    overallScore < -0.15 ? 'bearish' : 
    'neutral';
  
  // 4. 识别受影响资产
  const affectedAssets = identifyAffectedAssets(lowerText, dimensions);
  
  // 5. 提取关键词
  const keywords = extractFinancialKeywords(lowerText);
  
  // 6. 生成推理说明
  const reasoning = generateReasoning(overall, dimensions, affectedAssets, keywords);
  
  // 7. 计算综合置信度
  const confidence = Math.min(
    (baseConfidence * 0.5 + 
     Math.abs(overallScore) * 0.3 + 
     (affectedAssets.length > 0 ? 0.2 : 0)),
    0.95
  );
  
  return {
    overall,
    dimensions,
    confidence,
    affectedAssets,
    keywords,
    reasoning,
  };
}

/**
 * 计算市场情感 (-1 to 1)
 */
function calculateMarketSentiment(text: string, baseSentiment: number): number {
  let score = baseSentiment * 0.5; // 基础情感占50%
  
  // 统计牛市关键词
  let bullishCount = 0;
  for (const pattern of FINANCIAL_PATTERNS.bullish) {
    if (pattern.test(text)) bullishCount++;
  }
  
  // 统计熊市关键词
  let bearishCount = 0;
  for (const pattern of FINANCIAL_PATTERNS.bearish) {
    if (pattern.test(text)) bearishCount++;
  }
  
  // 计算关键词贡献
  const netSentiment = (bullishCount - bearishCount) / Math.max(bullishCount + bearishCount, 1);
  score += netSentiment * 0.5; // 关键词占50%
  
  return Math.max(-1, Math.min(1, score));
}

/**
 * 计算地缘政治风险 (0 to 1, 越高越危险)
 */
function calculateGeopoliticalRisk(text: string): number {
  let riskScore = 0;
  let matchCount = 0;
  
  for (const pattern of FINANCIAL_PATTERNS.geopoliticalRisk) {
    if (pattern.test(text)) {
      matchCount++;
      riskScore += 0.2;
    }
  }
  
  // 特定高危词汇加权
  if (/\b(nuclear|invasion|war\s+declared)\b/i.test(text)) {
    riskScore += 0.3;
  }
  
  return Math.min(1, riskScore);
}

/**
 * 计算经济前景情感 (-1 to 1)
 */
function calculateEconomicSentiment(text: string): number {
  let score = 0;
  
  for (const pattern of FINANCIAL_PATTERNS.economicPositive) {
    if (pattern.test(text)) score += 0.2;
  }
  
  for (const pattern of FINANCIAL_PATTERNS.economicNegative) {
    if (pattern.test(text)) score -= 0.2;
  }
  
  return Math.max(-1, Math.min(1, score));
}

/**
 * 计算紧急程度 (0 to 1)
 */
function calculateUrgency(text: string): number {
  let urgency = 0;
  
  for (const pattern of FINANCIAL_PATTERNS.urgency) {
    if (pattern.test(text)) urgency += 0.25;
  }
  
  return Math.min(1, urgency);
}

/**
 * 识别受影响的资产
 */
function identifyAffectedAssets(
  text: string,
  dimensions: FinancialSentiment['dimensions']
): FinancialSentiment['affectedAssets'] {
  const assets: FinancialSentiment['affectedAssets'] = [];
  
  // 检查大宗商品
  for (const [name, config] of Object.entries(ASSET_IMPACT_RULES.commodities)) {
    const relevance = config.keywords.filter(kw => text.includes(kw)).length;
    if (relevance > 0) {
      const impact = calculateAssetImpact(dimensions, config.riskMultiplier);
      for (const symbol of config.symbols.slice(0, 2)) {
        assets.push({
          type: 'commodity',
          symbol,
          name: name.toUpperCase(),
          impact,
          confidence: Math.min(relevance * 0.3, 0.9),
        });
      }
    }
  }
  
  // 检查外汇
  for (const [name, config] of Object.entries(ASSET_IMPACT_RULES.forex)) {
    const relevance = config.keywords.filter(kw => text.includes(kw)).length;
    if (relevance > 0) {
      const impact = calculateAssetImpact(dimensions, config.riskMultiplier);
      for (const symbol of config.symbols.slice(0, 2)) {
        assets.push({
          type: 'currency',
          symbol,
          name: name.toUpperCase(),
          impact,
          confidence: Math.min(relevance * 0.25, 0.85),
        });
      }
    }
  }
  
  // 检查股票/指数
  for (const [name, config] of Object.entries(ASSET_IMPACT_RULES.equities)) {
    const relevance = config.keywords.filter(kw => text.includes(kw)).length;
    if (relevance > 0) {
      const impact = calculateAssetImpact(dimensions, config.riskMultiplier);
      for (const symbol of config.symbols.slice(0, 3)) {
        assets.push({
          type: symbol.startsWith('^') ? 'index' : 'equity',
          symbol,
          name,
          impact,
          confidence: Math.min(relevance * 0.35, 0.9),
        });
      }
    }
  }
  
  return assets.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 8);
}

/**
 * 计算资产影响度
 */
function calculateAssetImpact(
  dimensions: FinancialSentiment['dimensions'],
  riskMultiplier: number
): number {
  const rawImpact = 
    dimensions.market * 0.5 + 
    dimensions.economic * 0.3 - 
    dimensions.geopolitical * 0.2;
  
  return Math.max(-1, Math.min(1, rawImpact * riskMultiplier));
}

/**
 * 提取金融关键词
 */
function extractFinancialKeywords(text: string): string[] {
  const keywords = new Set<string>();
  
  // 提取公司/机构名称（简化版）
  const entities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  entities.slice(0, 5).forEach(e => keywords.add(e));
  
  // 提取金融术语
  const financialTerms = [
    'fed', 'ecb', 'boj', 'pboc', 'interest rate', 'inflation', 'gdp',
    'earnings', 'revenue', 'profit', 'valuation', 'sanctions', 'tariff',
  ];
  
  for (const term of financialTerms) {
    if (text.includes(term)) keywords.add(term);
  }
  
  return Array.from(keywords).slice(0, 10);
}

/**
 * 生成分析推理
 */
function generateReasoning(
  overall: string,
  dimensions: FinancialSentiment['dimensions'],
  assets: FinancialSentiment['affectedAssets'],
  keywords: string[]
): string {
  const parts: string[] = [];
  
  // 整体判断
  if (overall === 'bullish') {
    parts.push('市场情绪偏多头');
  } else if (overall === 'bearish') {
    parts.push('市场情绪偏空头');
  } else {
    parts.push('市场情绪中性');
  }
  
  // 维度分析
  if (Math.abs(dimensions.geopolitical) > 0.5) {
    parts.push(`地缘风险${dimensions.geopolitical > 0.5 ? '高' : '低'}(${(dimensions.geopolitical * 100).toFixed(0)}%)`);
  }
  
  if (Math.abs(dimensions.economic) > 0.3) {
    parts.push(`经济前景${dimensions.economic > 0 ? '积极' : '消极'}`);
  }
  
  if (dimensions.urgency > 0.5) {
    parts.push(`紧急程度高(${(dimensions.urgency * 100).toFixed(0)}%)`);
  }
  
  // 受影响资产
  if (assets.length > 0) {
    const topAsset = assets[0]!;
    const direction = topAsset.impact > 0 ? '利好' : '利空';
    parts.push(`${direction}${topAsset.name}`);
  }
  
  return parts.join('，');
}

/**
 * 批量分析新闻标题
 */
export async function batchAnalyzeSentiment(titles: string[]): Promise<FinancialSentiment[]> {
  const results: FinancialSentiment[] = [];
  
  for (const title of titles) {
    try {
      const sentiment = await analyzeFinancialSentiment(title);
      results.push(sentiment);
    } catch (error) {
      console.error('[QuantSentiment] Failed to analyze:', title, error);
      // 返回中性默认值
      results.push({
        overall: 'neutral',
        dimensions: { market: 0, geopolitical: 0, economic: 0, urgency: 0 },
        confidence: 0,
        affectedAssets: [],
        keywords: [],
        reasoning: 'Analysis failed',
      });
    }
  }
  
  return results;
}
