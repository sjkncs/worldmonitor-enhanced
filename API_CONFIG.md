# API配置指南

## Twitter/X API
- 注册: https://developer.twitter.com
- 免费限额: 500k推文/月
- 环境变量: `TWITTER_BEARER_TOKEN`

## News API (CNN/Fox)
- 注册: https://newsapi.org
- 免费限额: 100请求/日
- 环境变量: `NEWS_API_KEY`

## 使用示例

```typescript
// Twitter
import { fetchTwitterFinancialSentiment } from '@/services/media-apis';
const tweets = await fetchTwitterFinancialSentiment(process.env.TWITTER_BEARER_TOKEN);

// News API
import { fetchNewsAPI } from '@/services/media-apis';
const news = await fetchNewsAPI(process.env.NEWS_API_KEY, ['cnn', 'fox']);
```

## 免费替代方案
- Twitter: nitter.net (镜像站)
- News: RSS订阅（无限额）
- 价格数据: Yahoo Finance API (免费)
