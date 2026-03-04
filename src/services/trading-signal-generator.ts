/**
 * Trading Signal Generator
 */

import type { NewsItem } from '@/types';
import { analyzeFinancialSentiment } from './quant-sentiment';

export interface TradingSignal {
  id: string;
  type: 'LONG' | 'SHORT' | 'NEUTRAL';
  asset: { symbol: string; name: string };
  confidence: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  reasoning: string;
  createdAt: Date;
}

export async function generateSignal(newsItem: NewsItem): Promise<TradingSignal | null> {
  const sentiment = await analyzeFinancialSentiment(newsItem.title);
  
  if (sentiment.affectedAssets.length === 0 || sentiment.confidence < 0.5) {
    return null;
  }
  
  const topAsset = sentiment.affectedAssets[0]!;
  const type = topAsset.impact > 0 ? 'LONG' : topAsset.impact < 0 ? 'SHORT' : 'NEUTRAL';
  const action = type === 'LONG' ? 'BUY' : type === 'SHORT' ? 'SELL' : 'HOLD';
  
  return {
    id: `signal-${Date.now()}`,
    type,
    asset: { symbol: topAsset.symbol, name: topAsset.name },
    confidence: sentiment.confidence,
    action,
    strength: Math.abs(topAsset.impact) * 100,
    reasoning: sentiment.reasoning,
    createdAt: new Date(),
  };
}
