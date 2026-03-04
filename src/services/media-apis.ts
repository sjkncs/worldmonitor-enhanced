/**
 * International Media API Integration
 * 国际媒体API集成：Twitter/X, CNN, Fox News, Bloomberg
 */

export interface MediaSource {
  id: string;
  name: string;
  url: string;
  tier: number;
  apiType: 'twitter' | 'news-api' | 'rss' | 'web-scraper';
}

// Twitter/X API v2 配置
export const TWITTER_CONFIG = {
  apiUrl: 'https://api.twitter.com/2',
  endpoints: {
    search: '/tweets/search/recent',
    userTimeline: '/users/:id/tweets',
  },
  // 关键金融账号
  financialAccounts: [
    { id: '1652541', username: 'Bloomberg', weight: 1.0 },
    { id: '87818409', username: 'CNBC', weight: 0.9 },
    { id: '3108351', username: 'WSJ', weight: 1.0 },
    { id: '742143', username: 'Reuters', weight: 1.0 },
    { id: '16334857', username: 'markets', weight: 0.8 },
    { id: '28140646', username: 'FT', weight: 0.9 },
    { id: '5402612', username: 'Forbes', weight: 0.7 },
    { id: '2467791', username: 'washingtonpost', weight: 0.8 },
    { id: '759251', username: 'CNN', weight: 0.8 },
    { id: '1367531', username: 'FoxNews', weight: 0.7 },
  ],
  // 搜索关键词
  keywords: [
    'Federal Reserve', 'interest rates', 'inflation', 'CPI', 'GDP',
    'recession', 'stock market', 'S&P500', 'Dow Jones', 'NASDAQ',
    'Bitcoin', 'cryptocurrency', 'oil prices', 'gold prices',
    'earnings', 'trade war', 'sanctions', 'central bank',
  ],
};

// News API配置 (聚合Fox, CNN等)
export const NEWS_API_CONFIG = {
  baseUrl: 'https://newsapi.org/v2',
  sources: {
    cnn: { id: 'cnn', tier: 2, category: 'general' },
    fox: { id: 'fox-news', tier: 2, category: 'general' },
    bloomberg: { id: 'bloomberg', tier: 1, category: 'business' },
    reuters: { id: 'reuters', tier: 1, category: 'general' },
    wsj: { id: 'the-wall-street-journal', tier: 1, category: 'business' },
    ft: { id: 'financial-times', tier: 1, category: 'business' },
  },
  endpoints: {
    topHeadlines: '/top-headlines',
    everything: '/everything',
  },
};

/**
 * 从Twitter获取金融舆情
 */
export async function fetchTwitterFinancialSentiment(
  apiKey: string,
  query?: string
): Promise<Array<{
  id: string;
  text: string;
  author: string;
  authorWeight: number;
  timestamp: string;
  metrics: { likes: number; retweets: number; replies: number };
}>> {
  const searchQuery = query || TWITTER_CONFIG.keywords.slice(0, 5).join(' OR ');
  
  try {
    const response = await fetch(
      `${TWITTER_CONFIG.apiUrl}${TWITTER_CONFIG.endpoints.search}?query=${encodeURIComponent(searchQuery)}&max_results=100&tweet.fields=created_at,public_metrics,author_id`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((tweet: any) => {
      const account = TWITTER_CONFIG.financialAccounts.find(
        a => a.id === tweet.author_id
      );
      
      return {
        id: tweet.id,
        text: tweet.text,
        author: account?.username || 'unknown',
        authorWeight: account?.weight || 0.5,
        timestamp: tweet.created_at,
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
        },
      };
    });
  } catch (error) {
    console.error('Twitter API fetch error:', error);
    return [];
  }
}

/**
 * 从News API获取CNN/Fox/Bloomberg新闻
 */
export async function fetchNewsAPI(
  apiKey: string,
  sources: Array<'cnn' | 'fox' | 'bloomberg' | 'reuters' | 'wsj' | 'ft'> = ['cnn', 'fox', 'bloomberg']
): Promise<Array<{
  title: string;
  description: string;
  url: string;
  source: string;
  sourceTier: number;
  publishedAt: string;
  content: string;
}>> {
  const sourceIds = sources.map(s => NEWS_API_CONFIG.sources[s].id).join(',');
  
  try {
    const response = await fetch(
      `${NEWS_API_CONFIG.baseUrl}${NEWS_API_CONFIG.endpoints.topHeadlines}?sources=${sourceIds}&pageSize=100&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    
    return (data.articles || []).map((article: any) => {
      const sourceKey = (sources.find(s => 
        NEWS_API_CONFIG.sources[s].id === article.source.id
      ) || sources[0]) as keyof typeof NEWS_API_CONFIG.sources;
      
      return {
        title: article.title,
        description: article.description || '',
        url: article.url,
        source: article.source.name,
        sourceTier: NEWS_API_CONFIG.sources[sourceKey].tier,
        publishedAt: article.publishedAt,
        content: article.content || article.description || '',
      };
    });
  } catch (error) {
    console.error('News API fetch error:', error);
    return [];
  }
}

/**
 * 计算Twitter舆情分数
 * 基于权威账号的观点加权
 */
export function calculateTwitterSentimentScore(
  tweets: Array<{
    text: string;
    authorWeight: number;
    metrics: { likes: number; retweets: number };
  }>
): {
  score: number; // -1 to 1
  volume: number;
  topInfluencers: string[];
} {
  if (tweets.length === 0) {
    return { score: 0, volume: 0, topInfluencers: [] };
  }

  let totalScore = 0;
  let totalWeight = 0;

  tweets.forEach(tweet => {
    // 简化情感分析（实际应使用FinBERT）
    const bullishWords = /\b(bull|rally|surge|gain|up|positive|growth)\b/gi;
    const bearishWords = /\b(bear|crash|fall|down|negative|recession)\b/gi;
    
    const bullishCount = (tweet.text.match(bullishWords) || []).length;
    const bearishCount = (tweet.text.match(bearishWords) || []).length;
    
    const sentiment = bullishCount - bearishCount;
    const engagementWeight = 1 + Math.log10(1 + tweet.metrics.likes + tweet.metrics.retweets * 2);
    const weight = tweet.authorWeight * engagementWeight;
    
    totalScore += sentiment * weight;
    totalWeight += weight;
  });

  return {
    score: totalWeight > 0 ? Math.max(-1, Math.min(1, totalScore / totalWeight)) : 0,
    volume: tweets.length,
    topInfluencers: [], // TODO: 统计最活跃账号
  };
}

/**
 * 免费替代方案说明
 */
export const FREE_ALTERNATIVES = {
  twitter: {
    note: 'Twitter API v2 需要申请开发者账号（免费版有限额）',
    alternatives: [
      'nitter.net - Twitter镜像站点（可爬取）',
      'snscrape - Python Twitter爬虫库',
      'Apify Twitter Scraper - 付费API',
    ],
  },
  newsApi: {
    note: 'News API 免费版每日100次请求',
    url: 'https://newsapi.org/pricing',
    freeQuota: '100 requests/day',
  },
  bloomberg: {
    note: 'Bloomberg Terminal需付费订阅（$2000+/月）',
    alternatives: [
      'Yahoo Finance API - 免费',
      'Alpha Vantage - 免费（限额）',
      'IEX Cloud - 免费层',
    ],
  },
};
