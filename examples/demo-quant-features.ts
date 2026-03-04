/**
 * 量化交易功能演示
 * Demo: Quantitative Trading Features
 */

import { analyzeFinancialSentiment } from '../src/services/quant-sentiment';
import { calculateNewsImpact } from '../src/services/news-impact-scorer';
import { generateSignal } from '../src/services/trading-signal-generator';

// ========== 演示 1: 美联储加息新闻分析 ==========
async function demo1_FedRateHike() {
  console.log('\n=== Demo 1: Fed Rate Hike Analysis ===\n');
  
  const newsTitle = "Federal Reserve raises interest rates by 0.75% to combat inflation";
  
  const sentiment = await analyzeFinancialSentiment(newsTitle);
  
  console.log('📰 新闻:', newsTitle);
  console.log('\n📊 情感分析结果:');
  console.log('  整体情绪:', sentiment.overall); // 预期: bearish
  console.log('  市场情绪:', sentiment.dimensions.market.toFixed(2)); // 预期: -0.4
  console.log('  地缘风险:', sentiment.dimensions.geopolitical.toFixed(2));
  console.log('  经济前景:', sentiment.dimensions.economic.toFixed(2)); // 预期: -0.6
  console.log('  置信度:', (sentiment.confidence * 100).toFixed(1) + '%');
  
  console.log('\n💰 受影响资产:');
  sentiment.affectedAssets.slice(0, 5).forEach(asset => {
    const direction = asset.impact > 0 ? '📈 利好' : '📉 利空';
    console.log(`  ${direction} ${asset.name} (${asset.symbol}): ${(asset.impact * 100).toFixed(0)}%`);
  });
  
  console.log('\n💡 分析理由:', sentiment.reasoning);
}

// ========== 演示 2: 地缘冲突新闻分析 ==========
async function demo2_GeopoliticalConflict() {
  console.log('\n=== Demo 2: Geopolitical Conflict ===\n');
  
  const newsTitle = "Iran threatens to close Strait of Hormuz amid escalating tensions";
  
  const sentiment = await analyzeFinancialSentiment(newsTitle);
  
  console.log('📰 新闻:', newsTitle);
  console.log('\n📊 情感分析:');
  console.log('  整体:', sentiment.overall); // 预期: bearish
  console.log('  地缘风险:', (sentiment.dimensions.geopolitical * 100).toFixed(0) + '%'); // 预期: 高
  console.log('  紧急程度:', (sentiment.dimensions.urgency * 100).toFixed(0) + '%');
  
  console.log('\n💰 受影响资产 (预期原油大涨):');
  sentiment.affectedAssets.forEach(asset => {
    if (asset.type === 'commodity' && asset.impact > 0.5) {
      console.log(`  ⚡ ${asset.name}: +${(asset.impact * 100).toFixed(0)}% 影响`);
    }
  });
}

// ========== 演示 3: 生成交易信号 ==========
async function demo3_GenerateTradingSignal() {
  console.log('\n=== Demo 3: Trading Signal Generation ===\n');
  
  const mockNewsItem = {
    title: "NVIDIA announces breakthrough AI chip, stock surges 15%",
    source: "Bloomberg",
    pubDate: new Date(),
    link: "https://example.com/news",
    category: "technology",
    threatLevel: "low",
  };
  
  const signal = await generateSignal(mockNewsItem);
  
  if (signal) {
    console.log('🎯 交易信号生成:');
    console.log('  操作:', signal.action); // BUY
    console.log('  方向:', signal.type); // LONG
    console.log('  资产:', `${signal.asset.name} (${signal.asset.symbol})`);
    console.log('  强度:', signal.strength.toFixed(0) + '/100');
    console.log('  置信度:', (signal.confidence * 100).toFixed(0) + '%');
    console.log('  理由:', signal.reasoning);
    console.log('  生成时间:', signal.createdAt.toLocaleString('zh-CN'));
  }
}

// ========== 演示 4: 新闻影响力评分 ==========
async function demo4_NewsImpactScoring() {
  console.log('\n=== Demo 4: News Impact Scoring ===\n');
  
  const highImpactNews = {
    title: "Breaking: Russia invades Ukraine",
    source: "Reuters", // Tier 1
    pubDate: new Date(),
    link: "",
    category: "conflict",
    threatLevel: "high",
  };
  
  const lowImpactNews = {
    title: "Local startup raises $1M seed round",
    source: "TechCrunch", // Tier 3
    pubDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    link: "",
    category: "business",
    threatLevel: "low",
  };
  
  const highScore = calculateNewsImpact(highImpactNews, 10); // 高传播速度
  const lowScore = calculateNewsImpact(lowImpactNews, 1);
  
  console.log('📊 高影响力新闻:');
  console.log('  新闻:', highImpactNews.title);
  console.log('  来源可信度:', (highScore.sourceCredibility * 100).toFixed(0) + '%');
  console.log('  传播速度:', highScore.viralityIndex.toFixed(1) + '/10');
  console.log('  综合评分:', highScore.impactScore.toFixed(1) + '/100');
  
  console.log('\n📊 低影响力新闻:');
  console.log('  新闻:', lowImpactNews.title);
  console.log('  来源可信度:', (lowScore.sourceCredibility * 100).toFixed(0) + '%');
  console.log('  综合评分:', lowScore.impactScore.toFixed(1) + '/100');
}

// ========== 演示 5: 批量分析新闻流 ==========
async function demo5_BatchAnalysis() {
  console.log('\n=== Demo 5: Batch News Analysis ===\n');
  
  const newsBatch = [
    "Oil prices surge 8% on OPEC production cuts",
    "Tech stocks rally on AI optimism",
    "Inflation data comes in worse than expected",
    "China reports strong GDP growth",
  ];
  
  console.log('📰 分析新闻批次 (' + newsBatch.length + '条):\n');
  
  for (const news of newsBatch) {
    const sentiment = await analyzeFinancialSentiment(news);
    const emoji = sentiment.overall === 'bullish' ? '🟢' : 
                  sentiment.overall === 'bearish' ? '🔴' : '⚪';
    
    console.log(`${emoji} ${sentiment.overall.toUpperCase()}`);
    console.log(`   "${news}"`);
    console.log(`   受影响: ${sentiment.affectedAssets.slice(0, 2).map(a => a.symbol).join(', ')}\n`);
  }
}

// ========== 演示 6: 实时风险监控模拟 ==========
async function demo6_RiskMonitoring() {
  console.log('\n=== Demo 6: Real-time Risk Monitoring ===\n');
  
  const portfolio = [
    { symbol: 'AAPL', weight: 0.3 },
    { symbol: 'NVDA', weight: 0.2 },
    { symbol: 'GC=F', weight: 0.15 }, // 黄金
    { symbol: 'CL=F', weight: 0.15 }, // 原油
    { symbol: 'EURUSD=X', weight: 0.2 },
  ];
  
  const recentNews = [
    "Federal Reserve maintains hawkish stance",
    "Middle East tensions escalate",
    "Tech earnings beat expectations",
  ];
  
  console.log('📊 投资组合风险评估:');
  console.log('\n组合配置:');
  portfolio.forEach(p => {
    console.log(`  ${p.symbol}: ${(p.weight * 100).toFixed(0)}%`);
  });
  
  console.log('\n近期新闻影响:');
  for (const news of recentNews) {
    const sentiment = await analyzeFinancialSentiment(news);
    const affectedInPortfolio = sentiment.affectedAssets
      .filter(a => portfolio.some(p => p.symbol === a.symbol))
      .slice(0, 2);
    
    if (affectedInPortfolio.length > 0) {
      console.log(`\n⚠️  "${news}"`);
      affectedInPortfolio.forEach(asset => {
        const direction = asset.impact > 0 ? '📈' : '📉';
        console.log(`    ${direction} ${asset.symbol}: ${(Math.abs(asset.impact) * 100).toFixed(0)}% 影响`);
      });
    }
  }
  
  console.log('\n💡 风险建议: 考虑对冲地缘风险（增加黄金或国债配置）');
}

// ========== 主函数：运行所有演示 ==========
async function runAllDemos() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  World Monitor - 量化交易功能演示          ║');
  console.log('║  Quantitative Trading Features Demo       ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    await demo1_FedRateHike();
    await demo2_GeopoliticalConflict();
    await demo3_GenerateTradingSignal();
    await demo4_NewsImpactScoring();
    await demo5_BatchAnalysis();
    await demo6_RiskMonitoring();
    
    console.log('\n\n✅ 所有演示完成！\n');
    console.log('💡 提示: 这些功能可以集成到现有的 World Monitor 系统中');
    console.log('📚 详细文档: 查看 OPTIMIZATION_RECOMMENDATIONS.md');
    
  } catch (error) {
    console.error('❌ 演示出错:', error);
  }
}

// 运行演示
if (typeof process !== 'undefined' && process.argv[1]?.includes('demo-quant')) {
  runAllDemos().catch(console.error);
}

export {
  demo1_FedRateHike,
  demo2_GeopoliticalConflict,
  demo3_GenerateTradingSignal,
  demo4_NewsImpactScoring,
  demo5_BatchAnalysis,
  demo6_RiskMonitoring,
};
