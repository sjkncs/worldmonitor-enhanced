/**
 * 预测精确性验证框架
 * Prediction Accuracy Validation Framework
 */

export interface PredictionRecord {
  id: string;
  timestamp: string;
  newsTitle: string;
  predictedSignal: 'BUY' | 'SELL' | 'HOLD';
  predictedChange: number; // 预测涨跌幅%
  predictedPrice?: number; // 预测价格
  currentPrice?: number; // 当前实际价格
  confidence: number;
  asset: string;
  actualChange?: number; // 实际涨跌幅%
  validated: boolean;
}

export interface ValidationMetrics {
  accuracy: number; // 准确率
  precision: number; // 精确率
  recall: number; // 召回率
  f1Score: number;
  mape: number; // 平均绝对百分比误差
  sharpeRatio: number;
  totalPredictions: number;
  correctPredictions: number;
  avgConfidence: number;
}

/**
 * 验证预测准确性
 */
export function validatePredictions(
  predictions: PredictionRecord[]
): ValidationMetrics {
  const validated = predictions.filter(p => p.validated && p.actualChange !== undefined);
  
  if (validated.length === 0) {
    return {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      mape: 0,
      sharpeRatio: 0,
      totalPredictions: 0,
      correctPredictions: 0,
      avgConfidence: 0,
    };
  }

  let correct = 0;
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let mapeSum = 0;

  validated.forEach(pred => {
    const actual = pred.actualChange!;
    const predicted = pred.predictedChange;
    
    // 方向正确性
    const actualDirection = actual > 0 ? 'BUY' : actual < 0 ? 'SELL' : 'HOLD';
    if (pred.predictedSignal === actualDirection) {
      correct++;
    }

    // 精确率/召回率计算
    if (pred.predictedSignal === 'BUY') {
      if (actual > 0) truePositives++;
      else falsePositives++;
    } else if (pred.predictedSignal === 'SELL') {
      if (actual < 0) truePositives++;
      else falseNegatives++;
    }

    // MAPE计算
    if (actual !== 0) {
      mapeSum += Math.abs((actual - predicted) / actual);
    }
  });

  const accuracy = correct / validated.length;
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1 = 2 * (precision * recall) / (precision + recall) || 0;
  const mape = (mapeSum / validated.length) * 100;

  return {
    accuracy,
    precision,
    recall,
    f1Score: f1,
    mape,
    sharpeRatio: 0, // 需要收益率序列计算
    totalPredictions: predictions.length,
    correctPredictions: correct,
    avgConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
  };
}

/**
 * 生成验证报告
 */
export function generateValidationReport(metrics: ValidationMetrics): string {
  return `
预测精确性验证报告
===================

总预测数: ${metrics.totalPredictions}
已验证: ${metrics.totalPredictions}
正确预测: ${metrics.correctPredictions}

核心指标:
- 准确率: ${(metrics.accuracy * 100).toFixed(2)}%
- 精确率: ${(metrics.precision * 100).toFixed(2)}%
- 召回率: ${(metrics.recall * 100).toFixed(2)}%
- F1分数: ${(metrics.f1Score * 100).toFixed(2)}%
- MAPE: ${metrics.mape.toFixed(2)}%
- 平均置信度: ${(metrics.avgConfidence * 100).toFixed(2)}%

评级: ${getRating(metrics.accuracy)}
`.trim();
}

function getRating(accuracy: number): string {
  if (accuracy >= 0.8) return '优秀 ⭐⭐⭐⭐⭐';
  if (accuracy >= 0.7) return '良好 ⭐⭐⭐⭐';
  if (accuracy >= 0.6) return '合格 ⭐⭐⭐';
  return '需改进 ⭐⭐';
}

/**
 * 实时验证单个预测
 */
export async function validateSinglePrediction(
  prediction: PredictionRecord,
  getCurrentPrice: (asset: string) => Promise<number>
): Promise<PredictionRecord> {
  try {
    const currentPrice = await getCurrentPrice(prediction.asset);
    // 计算实际涨跌幅
    if (prediction.predictedPrice) {
      const actualChange = ((currentPrice - prediction.predictedPrice) / prediction.predictedPrice) * 100;
      prediction.actualChange = actualChange;
    }
    prediction.validated = true;
    prediction.currentPrice = currentPrice;
    return prediction;
  } catch (error) {
    console.error('Validation error:', error);
    return prediction;
  }
}
