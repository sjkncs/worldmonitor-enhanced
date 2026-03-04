import { Panel } from './Panel';
import { escapeHtml } from '@/utils/sanitize';

export class MilitaryTrackingPanel extends Panel {
  constructor() {
    super({ id: 'military-tracking', title: '军事动态追踪' });
  }

  public renderAircraft(aircraft: Array<{ callsign: string; country: string; altitude: number; velocity: number; category: string }>): void {
    if (aircraft.length === 0) {
      this.showError('暂无军机数据');
      return;
    }

    const html = aircraft.slice(0, 10).map(a => `
      <div class="market-item">
        <div class="market-info">
          <span class="market-name">${escapeHtml(a.callsign)}</span>
          <span class="market-symbol">${escapeHtml(a.country)}</span>
        </div>
        <div class="market-data">
          <span class="text-xs">高度: ${(a.altitude / 1000).toFixed(1)}km</span>
          <span class="text-xs">速度: ${(a.velocity * 3.6).toFixed(0)}km/h</span>
          <span class="text-xs">${a.category}</span>
        </div>
      </div>
    `).join('');

    this.setContent(`<div class="space-y-2">${html}</div>`);
  }
}
