import { Panel } from './Panel';
import { escapeHtml } from '@/utils/sanitize';
import { getChangeClass } from '@/utils';

export class QuantTradingPanel extends Panel {
  constructor() {
    super({ id: 'quant-trading', title: '量化交易信号' });
  }

  public renderSignals(signals: Array<{ asset: string; signal: string; confidence: number; change: number }>): void {
    if (signals.length === 0) {
      this.showError('暂无交易信号');
      return;
    }

    const html = signals.map(s => `
      <div class="market-item">
        <div class="market-info">
          <span class="market-name">${escapeHtml(s.asset)}</span>
          <span class="market-symbol ${s.signal === 'BUY' ? 'text-green-500' : s.signal === 'SELL' ? 'text-red-500' : ''}">${s.signal}</span>
        </div>
        <div class="market-data">
          <span class="market-price">置信度: ${(s.confidence * 100).toFixed(0)}%</span>
          <span class="market-change ${getChangeClass(s.change)}">${s.change > 0 ? '+' : ''}${s.change.toFixed(2)}%</span>
        </div>
      </div>
    `).join('');

    this.setContent(html);
  }
}
