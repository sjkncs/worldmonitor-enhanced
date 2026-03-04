import { Panel } from './Panel';
import { escapeHtml } from '@/utils/sanitize';
import { getChangeClass } from '@/utils';

export class EnergyIntelPanel extends Panel {
  constructor() {
    super({ id: 'energy-intel', title: '能源情报监控' });
  }

  public renderPrices(prices: Array<{ commodity: string; price: number; unit: string; change24h: number }>): void {
    if (prices.length === 0) {
      this.showError('暂无能源数据');
      return;
    }

    const html = prices.map(p => `
      <div class="market-item">
        <div class="market-info">
          <span class="market-name">${escapeHtml(p.commodity)}</span>
          <span class="market-symbol">${escapeHtml(p.unit)}</span>
        </div>
        <div class="market-data">
          <span class="market-price">$${p.price.toFixed(2)}</span>
          <span class="market-change ${getChangeClass(p.change24h)}">${p.change24h > 0 ? '+' : ''}${p.change24h.toFixed(2)}%</span>
        </div>
      </div>
    `).join('');

    this.setContent(html);
  }
}
