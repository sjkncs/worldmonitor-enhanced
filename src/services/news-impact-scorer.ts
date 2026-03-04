/**
 * News Impact Scorer - 新闻影响力评分
 */

import type { NewsItem } from '@/types';
import { SOURCE_TIERS } from '@/config/feeds';

export interface NewsImpactMetrics {
  impactScore: number;
  viralityIndex: number;
  sourceCredibility: number;
}

export function calculateNewsImpact(
  newsItem: NewsItem,
  spikeMultiplier = 1
): NewsImpactMetrics {
  const sourceTier = SOURCE_TIERS[newsItem.source] || 4;
  const sourceCredibility = (5 - sourceTier) / 4;
  
  const ageMinutes = (Date.now() - newsItem.pubDate.getTime()) / 60000;
  const recencyDecay = Math.exp(-ageMinutes / 120);
  
  const viralityIndex = Math.min(10, spikeMultiplier * 2);
  const impactScore = sourceCredibility * 40 + viralityIndex * 30 + recencyDecay * 30;
  
  return { impactScore, viralityIndex, sourceCredibility };
}
